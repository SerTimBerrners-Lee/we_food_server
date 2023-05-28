import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { StatusBid } from 'src/enums';

@Injectable()
export class BidService {
	constructor(
		@InjectModel(Bid) private bidRepository: typeof Bid
	) {}

	async requestCall(phone: string) {
		try {
			const new_bid = await this.bidRepository.create({
				phone: phone
			});

			if (!new_bid)
				return { success: false, error: 'Не удалось составить заявку' }
	
			return { body: new_bid, success: true };
		} catch (err) {
			console.error(err);

			return { success: false, error: err.message }
		}
	}

	async findAll(page = 1, limit = 25): Promise<{ data: Bid[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.bidRepository.findAndCountAll({
			offset, limit, where: { status: StatusBid.open }
		});

		return { data: rows, total: count, success: true };
	}
}
