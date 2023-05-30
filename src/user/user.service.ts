import { Injectable } from '@nestjs/common';
import { UpCreateUserDto } from './dto/up-create-user.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { ClientStatus, Role } from 'src/enums';
import { Op } from 'sequelize';
import { normalizePhoneNumber } from 'src/lib/phone_methods';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private mailService: MailService,
	) {}

	async createUser(dto: UpCreateUserDto) {
		try {
			const findUser = await this.checkBeforeChenges(dto, { email: '', phone: '' });
			if (!findUser.success) return findUser;

			let hashedPassword = null;
			// Для сотрудников генерируем пароль и отправляем им на почту
			if (dto.role != Role.client) {
				const password = Math.random().toString(36).slice(-8);
				hashedPassword = await bcrypt.hash(password, 5);

				await this.mailService.sendPasswordForNewUser(dto.email, password, dto.name);
			}

			// Сохранение данных
			const createUser = await this.userRepository.create({
				...dto,
				password: hashedPassword,
			});
		
			return { data: createUser, success: true };

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	async createClient(phone: string) {
		try {

			const format_phone = normalizePhoneNumber(phone);
			const findUser = await this.findByPhone(format_phone)
			if (findUser.success) return { success: false, error: 'Пользователь с таким Номером уже зарегестрирован' }

			const newClient = await this.userRepository.create({
				status: ClientStatus.not_confirmed,
				phone: phone
			});

			if (!newClient) return { success: false, error: 'Произошла системная ошибка' }
			return { success: true, data: newClient };

		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}

	
	async update(dto: UpCreateUserDto) {
		const user = await this.userRepository.findByPk(dto.id);

		const checkUser = await this.checkBeforeChenges(dto, user);
		if (!checkUser.success) return checkUser;
	
		if (!user)
			return { success: false, error: 'Пользователь не найден' };

		const newUser = await user.update({
			...dto
		});

		return { data: user, success: true };
	}

	async resetPassword(user_id: number) {
		try {
			const findUser = await this.userRepository.findOne({ 
				where: { id: user_id }
			});
	
			if (!findUser)
				return { success: false, error: "Пользователь не найден" }
	
			const password = Math.random().toString(36).slice(-8);
			let hashedPassword = await bcrypt.hash(password, 5);
	
			findUser.password = hashedPassword;
			await findUser.save();
			await this.mailService.sendUpdatePasswordForUser(findUser.email, password, findUser.name);

			return { data: findUser, success: true }
		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}

	}

	/**
	 * Проверяем на совпадение по почте и по номеру перед изменениями
	 * (Вдруг у кого-то уже есть такие почта или телефон)
	 * @param dto 
	 * @param user 
	 * @returns 
	 */
	private async checkBeforeChenges(dto: any, user = null) {
		let success_email = true;
		let success_phone = true;

		if (dto.email != user.email) {
			const findUser = await this.findByEmail(dto.email);
			if (findUser.success) success_email = false;
		}

		const phone = normalizePhoneNumber(dto.phone);
		if (phone != user.phone) {
			const findUser = await this.findByPhone(phone)
			if (findUser.success) success_phone = false;
		}

		const str = `
			Пользователь с ${!success_email ? 'такой почтой' : ' '} 
			${!success_email && !success_phone ? 'и' : ' '}
			${!success_phone ? 'таким номером' : ' '}
			уже зарегистрирован`;
		
		if (success_email && success_phone) return { success: true }
		return { success: false, error: str }
	}

	async findOne(user_id: number) {
		const user = await this.userRepository.findByPk(user_id);
		if (!user)
			return { success: false, error: 'Не удалось получить пользователя' }

		return { success: true, data: user };
	}

	async findAll(page = 1, limit = 25): Promise<{ data: User[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.userRepository.findAndCountAll({
			offset, limit, where: { ban: false }
		});

		return { data: rows, total: count, success: true };
	}

	async findNotConfirmed(page = 1, limit = 25): Promise<{ data: User[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.userRepository.findAndCountAll({
			offset, limit, where: { ban: false, status: ClientStatus.not_confirmed }
		});

		return { data: rows, total: count, success: true };
	}c

	async findAllBanned(page = 1, limit = 25): Promise<{ data: User[]; total: number, success: boolean }> {
		const offset = (page - 1) * limit;
		const { count, rows } = await this.userRepository.findAndCountAll({
			offset, limit, where: { ban: true }
		});

		return { data: rows, total: count, success: true };
	}

	async userToggleBan(user_id: number) {
		try {

			const findUser = await this.userRepository.findByPk(user_id);

			if (!findUser)
				return { error: 'Не удалось найти пользователя', success: false };

			if (findUser.role === Role.admin) {
				// Если все администраторы забанены и остался последний - кидаем ошибку
				const findAdminCount = await this.userRepository.count({
					where: {
						role: 'admin',
						ban: false,
					}
				});
			
				if (findAdminCount < 2)
					return { error: 'Вы не можете удалить последнего администратора', success: false };
			}

			findUser.ban = !findUser.ban;

			await findUser.save();

			return { data: user_id, success: true };
		} catch(err) {
			console.error(err);
			const msg = err.message;

			return { success: false, error: msg };
		} 
	}

	async findByEmail(email: string) {
		try {
			const user = await this.userRepository.findOne({ 
				where: {
					email: {
						[Op.iLike] : `%${email}%`
					}
				}
			});

			if (!user) return { error: 'Пользователь не найден', success: false };
	
			return { data: user, success: true };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}

	/**
	 * Пробиваем по номеру телефона :)
	 * @param phone 
	 * @returns 
	 */
	async findByPhone(phone: string) {
		try {
			const format_phone = normalizePhoneNumber(phone);

			const findUser = await this.userRepository.findOne({ where: { phone: {
				[Op.iLike] : `%${format_phone}%`
			}}}); 

			if (!findUser)
				return { success: false, error: 'Пользователь не найден' };
			
			return { success: true, data: findUser }

		} catch (err) {
			console.error(err);
			return { success: false, error: err.message };
		}
	}
}
