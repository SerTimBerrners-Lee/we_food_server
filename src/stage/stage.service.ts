import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stage } from './stage.model';
import { CreateStageDto } from './dto/create.dto';
import { User } from 'src/user/user.model';
import { Order } from 'src/order/order.model';
import { StageStatus } from 'src/enums';

@Injectable()
export class StageService {
	constructor(@InjectModel(Stage) private stageRepository: typeof Stage) {}

	async create(dto: CreateStageDto) {
		try {
			const stage = await this.stageRepository.create({
				...dto,
			});
		
			console.log(dto);
			console.log(stage);

			return { data: stage, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async getByPk(stage_id: number) {
		try {
			const stage = await this.stageRepository.findByPk(stage_id);
			if (!stage) return { success: false, error: 'Произошла ошибка' };

			return { success: true, data: stage };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message };
		}
	}

	async findAll(page = 1, limit = 25, status = StageStatus.kitchen): Promise<{ data: Stage[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.stageRepository.findAndCountAll({
			offset, limit, where: { ban: false, status },
			include: [
				{
					model: User
				},
				{
					model: Order
				}
			]
		});

		return { data: rows, total: count, success: true };
	}

	async findAllBanned(page = 1, limit = 25, status = StageStatus.kitchen): Promise<{ data: Stage[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.stageRepository.findAndCountAll({
			offset, limit, where: { ban: true, status },
			include: [
				{
					model: User
				},
				{
					model: Order
				}
			]
		});

		return { data: rows, total: count, success: true };
	}

	async toDelivery(id: number) {
		const stage = await this.stageRepository.findByPk(id);
		if (!stage) return { error: 'Не удалось найти заказ', success: false };

		stage.status = StageStatus.delivery;
		await stage.save();

		return { data: stage, success: true };
	}

	async toComplited(id: number) {
		const stage = await this.stageRepository.findByPk(id);
		if (!stage) return { error: 'Не удалось найти заказ', success: false };

		stage.status = StageStatus.complited;
		await stage.save();

		return { data: stage, success: true };
	}
}
