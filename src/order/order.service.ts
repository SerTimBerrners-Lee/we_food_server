import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { UpCreateOrderDto } from './dto/up-create.dto';
import { User } from 'src/user/user.model';
import { ProductLine } from 'src/product_line/product_line.model';
import { Stage } from 'src/stage/stage.model';
import { ProcessingOrder, StatusOrder } from 'src/enums';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order) private orderRepository: typeof Order
	) {}

	async create(dto: UpCreateOrderDto) {
		try {
			// Сохранение данных
			const createOrder = await this.orderRepository.create({
				...dto,
			});

			if (!createOrder) return { error: 'Не удалось сохранить заказ', success: false };
			const findNewOrder = await this.findOne(createOrder.id);

			return { data: findNewOrder, success: true };
		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async update(dto: UpCreateOrderDto) {
		const order = await this.orderRepository.findByPk(dto.id, {
			include: [
				{
					model: User
				},
				{
					model: ProductLine
				}
			]
		});
		if (!order)
			return { success: false, error: 'Пользователь не найден' };


		order.update({
			...dto
		});

		return { data: order, success: true };
	}

	async findOne(order_id: number) {
		const order = await this.orderRepository.findByPk(order_id, {
			include: [
				{
					model: User
				},
				{
					model: ProductLine
				},
				{
					model: Stage,
					attributes: ['id', 'status'],
					order: [
						['id', 'DESC']
					]
				}
			]
		});
		if (!order)
			return { success: false, error: 'Не удалось получить пользователя' }

		return { success: true, data: order };
	}

	async findAll(page = 1, limit = 25): Promise<{ data: Order[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.orderRepository.findAndCountAll({
			offset, limit, where: { ban: false, processing: ProcessingOrder.confirmed },
			include: [
				{
					model: User
				},
				{
					model: ProductLine
				},
				{
					model: Stage,
					attributes: ['id', 'status'],
					order: [
						['id', 'DESC']
					]
				}
			]
		});

		return { data: rows, total: count, success: true };
	}

	async findNotConfirmed(page = 1, limit = 25): Promise<{ data: Order[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.orderRepository.findAndCountAll({
			offset, limit, where: { ban: false, processing: ProcessingOrder.not_confirmed },
			include: [
				{
					model: User
				},
				{
					model: ProductLine
				},
				{
					model: Stage,
					attributes: ['id', 'status'],
					order: [
						['id', 'DESC']
					]
				}
			]
		});

		return { data: rows, total: count, success: true };
	}

	async getMyOrders(user_id: number) {
		try {
			const orders = await this.orderRepository.findAll({
				where : {
					user_id: user_id,
					ban: false,
				},
				include: [
					{
						model: User
					},
					{
						model: ProductLine
					},
					{
						model: Stage,
						attributes: ['id', 'status'],
						order: [
							['id', 'DESC']
						]
					}
				]
			});

			return { data: orders, success: true }
		} catch (err) {
			console.error(err);
			return { error: err.message, success: false };
		}
	}

	async findAllBanned(page = 1, limit = 25): Promise<{ data: Order[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.orderRepository.findAndCountAll({
			offset, limit, where: { ban: true },
			include: [
				{
					model: User
				},
				{
					model: ProductLine
				},
				{
					model: Stage,
					attributes: ['id', 'status'],
					order: [
						['id', 'DESC']
					]
				}
			]
		});

		return { data: rows, total: count, success: true };
	}

	async toggleBan(order_id: number) {
		try {

			const order = await this.orderRepository.findByPk(order_id);

			if (!order)
				return { error: 'Не удалось найти пользователя', success: false };

			order.ban = !order.ban;

			await order.save();

			return { data: order_id, success: true };
		} catch(err) {
			console.error(err);
			const msg = err.message;

			return { success: false, error: msg };
		} 
	}

	async findAllByWhere(where = {}, include = {}, order = []) {
		const orders = await this.orderRepository.findAll({ where, include, order });
		return orders;
	}

}
