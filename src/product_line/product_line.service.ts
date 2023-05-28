import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductLine } from './product_line.model';
import { UpCreatePLDto } from './dto/up-create-pl.dto';
import { Op } from 'sequelize';
import { StatusProductLine } from 'src/enums';

@Injectable()
export class ProductLineService {
	constructor(
		@InjectModel(ProductLine) private plRepostory: typeof ProductLine
	) {}

	async create(dto: UpCreatePLDto) {
		try {
			const findPL = await this.plRepostory.findOne({ where: { line_name: {
				[Op.iLike] : `%${dto.line_name}%`
			}}});

			if (findPL)
				return { data: findPL, success: false, error: 'Линейка с таким названием уже создана' }

		
			// Сохранение данных
			const create = await this.plRepostory.create({
				...dto,
				precent_range_discont: dto.precent_range_discont ? JSON.stringify(dto.precent_range_discont) : '[]',
			});
		
			return { data: create, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async update(dto: UpCreatePLDto) {
		try {
			const PL = await this.plRepostory.findByPk(dto.id);

			PL.update({
				...dto,
				precent_range_discont: dto.precent_range_discont ? JSON.stringify(dto.precent_range_discont) : '[]',
			});

			if (!PL)
				return { success: false, error: 'ОБъект не найден' }
		
			return { data: PL, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async findAll(page = 1, limit = 25): Promise<{ data: ProductLine[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.plRepostory.findAndCountAll({
			offset, limit
		});

		return { data: rows, total: count, success: true };
	}

	async findAllBanned(page = 1, limit = 25): Promise<{ data: ProductLine[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.plRepostory.findAndCountAll({
			offset, limit
		});

		return { data: rows, total: count, success: true };
	}

	async userToggleBan(pl_id: number) {
		try {

			const findPL = await this.plRepostory.findByPk(pl_id);

			if (!findPL)
				return { error: 'Не удалось найти продуктовую линейку', success: false };

			if (findPL.status == StatusProductLine.not_revelant)
				findPL.status = StatusProductLine.revelant;
			else findPL.status = StatusProductLine.revelant;

			await findPL.save();

			return { data: findPL.id, success: true };
		} catch(err) {
			console.error(err);
			const msg = err.message;

			return { success: false, error: msg };
		} 
	}

	async getOne(pl_id: number) {
		const PL = await this.plRepostory.findByPk(pl_id);
		
		if (!PL) return { success: false, error: 'Выбраного продукта не найдено' }

		return { data: PL, success: true };
	}

	async getActuallyPl() {
		try {
			const PL = await this.plRepostory.findAll({
				where: { status: StatusProductLine.revelant }
			});

			if (!PL)
				return { success: false, error: 'ОБъект не найден' }
		
			return { data: PL, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}
}
