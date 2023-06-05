import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { Role, StatusBid } from 'src/enums';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BidService {
	constructor(
		@InjectModel(Bid) private bidRepository: typeof Bid,
		private userService: UserService,
		private mailService: MailService
	) {}

	async requestCall(phone: string) {
		try {
			const new_bid = await this.bidRepository.create({
				phone: phone
			});

			if (!new_bid)
				return { success: false, error: 'Не удалось составить заявку' }

			// Получаем всей админов и ставим в известность
			const users = await this.userService.findAllByRole([Role.admin, Role.manager]);

			console.log("users: ", users)
			if (users.success) {
				const data = users.data;
				const emails = data.map(el => el.email);
				this.mailService.newBidRequest(phone, emails);
			}

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
