import { Injectable } from '@nestjs/common';
import { UpCreateUserDto } from './dto/up-create-user.dto';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import { ClientStatus, Role } from 'src/enums';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private mailService: MailService,
	) {}

	async createUser(dto: UpCreateUserDto) {
		try {
			const findUser = await this.userRepository.findOne({ where: { email: {
				[Op.iLike] : `%${dto.email}%`
			}}});

			if (findUser)
				return { data: findUser, success: false, error: 'Пользователь с таким email уже зарегестрирован на платформе' }

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
		if (!user)
			return { success: false, error: 'Пользователь не найден' };


		user.update({
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

	async getByEmail(email: string) {
		const user = await this.userRepository.findOne({ 
			where: {
				email: {
					[Op.iLike] : `%${email}%`
				}
			}
		});

		return user;
	}

	async findByPhone(phone: string) {
		try {
			const findUser = await this.userRepository.findOne({ where: { phone: {
				[Op.iLike] : `%${phone}%`
			}}}); 

			if (!findUser)
				return { success: false, errorr: 'Пользователь не найден' };
			
			return { success: true, data: findUser }

		} catch (err) {
			console.error(err);
			return { success: false, error: err.message };
		}
	}
}
