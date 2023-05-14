import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpCreateDishesDto } from './dto/up-create.dtp';
import { Dishes } from './dishes.model';

@Injectable()
export class DishesService {
	constructor(
		@InjectModel(Dishes) private dishesRepository: typeof Dishes
	) {}

	async create(dto: UpCreateDishesDto) {
		try {
			// Сохранение данных
			const createDishes = await this.dishesRepository.create({
				...dto,
			});
		
			return { data: createDishes, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async update(dto: UpCreateDishesDto) {
		const order = await this.dishesRepository.findByPk(dto.id);
		if (!order)
			return { success: false, error: 'Пользователь не найден' };


		order.update({
			...dto
		});

		return { data: order, success: true };
	}

	async findOne(order_id: number) {
		const dishes = await this.dishesRepository.findByPk(order_id);
		if (!dishes)
			return { success: false, error: 'Не удалось получить пользователя' }

		return { success: true, data: dishes };
	}

	async findAll(page = 1, limit = 25): Promise<{ data: Dishes[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.dishesRepository.findAndCountAll({
			offset, limit, where: { ban: false }
		});

		return { data: rows, total: count, success: true };
	}

	async findAllBanned(page = 1, limit = 25): Promise<{ data: Dishes[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.dishesRepository.findAndCountAll({
			offset, limit, where: { ban: true }
		});

		return { data: rows, total: count, success: true };
	}

	async toggleBan(dishes_id: number) {
		try {

			const dishes = await this.dishesRepository.findByPk(dishes_id);

			if (!dishes)
				return { error: 'Не удалось найти пользователя', success: false };

			dishes.ban = !dishes.ban;

			await dishes.save();

			return { data: dishes_id, success: true };
		} catch(err) {
			console.error(err);
			const msg = err.message;

			return { success: false, error: msg };
		} 
	}

}
