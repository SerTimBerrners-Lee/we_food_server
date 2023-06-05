import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Promo } from './promo.model';
import { Op } from 'sequelize';
import { UpCreatePromoDto } from './dto/UpCreatePromo.dto';

@Injectable()
export class PromoService {
	constructor(@InjectModel(Promo) private promoRepository: typeof Promo) {}

	async findAll() {
		try {
			const currentDate = new Date();

			const promos = await this.promoRepository.findAll({
				where: {
					max_date_actions: {
						[Op.gte]: currentDate
					}
				}
			});

			if (!promos) return { success: false, error: 'Не удалось получить промокоды' }
			return { success: true, data: promos };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}

	async create(dto: UpCreatePromoDto) {
		try {
			console.log(dto)
			const promo = await this.promoRepository.create(dto);

			if (!promo) return { success: false, error: 'Не удалось создать промокод' }
			return { success: true, data: promo };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}

	async update(dto: UpCreatePromoDto) {
		try {
			console.log(dto);
			const promo = await this.promoRepository.findByPk(dto.id);

			if (!promo) return { success: false, error: 'Не удалось найти промокод по ID' }

			promo.name = dto.name;
			promo.description = dto.description;
			promo.max_date_actions = dto.max_date_actions;

			await promo.save();
			return { success: true, data: promo };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}
}
