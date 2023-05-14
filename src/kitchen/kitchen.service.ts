import { Injectable } from '@nestjs/common';
import { ProcessingOrder, StatusOrder } from 'src/enums';
import { getDaysDiff } from 'src/lib/date_methods';
import { OrderService } from 'src/order/order.service';
import { Stage } from 'src/stage/stage.model';
import { StageService } from 'src/stage/stage.service';

@Injectable()
export class KitchenService {
	constructor(
		private stageService: StageService,
		private orderService: OrderService
	) {}

	/**
	 * 
	 */
	async formNewStagesToday() {
		// 1. Получаем все актуальные заказы.
		const actual_orders = await this.orderService.findAllByWhere({
			ban: false,
			status: StatusOrder.in_work,
			processing: ProcessingOrder.confirmed
		}, [{
			model: Stage,
			as: 'stages'
		}], [[
				{
					model: Stage,
					as: 'stages'
				}, 'createdAt', 'ASC' 
		]]
		);

		const today = new Date().toLocaleDateString('ru-RU');

		try {
			for (const order of actual_orders) {
				if (!order.date_range || !order.user_id) continue;
				const [dat1, dat2] = order.date_range.split('|');
	
				// 2. Проверку на просрочку по последнему дню доставки
				const delay = getDaysDiff(today, dat2);
				if (delay < 0 || (delay == 0 && order.devide_by > 1)) continue;
				// 2.1 Если первый заказ будет послезавтар а не завтра - пропускаем
				const early = getDaysDiff(today, dat1);
				if (early > 1) continue;
	
				if (!order.stages.length) {
					await createNewStage(order.user_id, order.id);
					continue;
				}
	
				// Теперь дата следующего заказа = дата последнего stages 
				// и отличаться она должна уже на devide_by
				const last_stage = order.stages[order.stages.length - 1];
				if (last_stage) {
					const last_date = new Date(last_stage.createdAt).toLocaleDateString('ru-RU');
					const difference = getDaysDiff(today, last_date);
	
					if (difference <= -order.devide_by) {
						await createNewStage(order.user_id, order.id);
						continue;
					}
				}
			}
	
			return { data: { message: 'Данные успешно обновлены' }, success: true };
	
			async function createNewStage(user_id: number, order_id: number) {
				await this.stageService.create({
					user_id: user_id,
					order_id: order_id
				});
			}
		} catch(err) {
			console.error(err);
			return { error: err.message, success: false };
		}
	}
}
