import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientStatus, Role } from 'src/enums';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AuthCode } from './auth-code.model';
import { normalizePhoneNumber } from 'src/lib/phone_methods';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		@InjectModel(AuthCode) private authCodeRepository: typeof AuthCode,
	) {}

	async loginCRM(email: string, password: string) {

		try {
			if (!email || !password)
				return { error: 'Пароль или логин некорректны', success: false };
				
			const res = await this.userService.findByEmail(email);
			
			if (!res.success) return res;

			const user = res.data;

			if (user.role === Role.client)
				return { error: 'Клиент не имеет доступа в CRM систему', success: false };

			const passwordEquals = await bcrypt.compare(password, user.password);

			if (!passwordEquals)
				return { error: 'Некорректный пароль', success: false };


			const token = await this.generateToken(user);

			if (user.status != ClientStatus.confirmed) {
				user.status = ClientStatus.confirmed;
				await user.save();
			}

			return { data: { token, user }, success: true };

		} catch (err) {
			console.error(err);
			return { success: false, error: err.message };
		}
	}

	private async generateToken(user: User) {
		const payload = { email: user.email, id: user.id, roles: user.role, name: user.name, surname: user.surname } 
		return this.jwtService.sign(payload);
	}

	async authByPhone(phone: string) {
		try {
			if (!phone || phone.length < 7) return { success: false, error: 'Введите правильный номер' };
			const formatPhone = normalizePhoneNumber(phone);

			let findUser: any = await this.userService.findByPhone(formatPhone);

			if (!findUser.success)
				findUser = await this.userService.createClient(formatPhone);
			
			if (!findUser || !findUser.success)
				return { success: false, error: 'Произошла системная ошибка, пожалуйста обратитесь в поддержку'};

			if (findUser.ban) return { success: false, error: 'Извините, вы не имеете доступа в систему'};

			const min = 1000;
			const max = 9999;

			const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			console.log("randomNumber: ", randomNumber);

			// Перед созданием удаляем все уже имеющиеся записи (если они есть)
			const findAllCode = await this.authCodeRepository.findAll({
				where: { user_id: findUser.data.id }
			});
			for (const item of findAllCode) {
				await item.destroy();
			}

			const code = await this.authCodeRepository.create({
				user_id: findUser.data.id,
				code: randomNumber.toString()
			});

			if (!code)
				return { success: false, error: 'Произошла ошибка при отправки сообщения' }
			
			return { success: true, data: { message: 'Код успешно отправлен' } }

		} catch (err) {
			console.error(err);
			const error = err.message;
			return { success: false, error: error };
		}
	}

	/**
	 * Подтверждаем получение кода от пользователя
	 * @param code 
	 * @param phone 
	 * @returns 
	 */
	async confirmationCode(code: string, phone: string) {
		try {
			if (!code || code.length < 4) return { success: false, error: 'Введите правильный код' };

			const formatPhone = normalizePhoneNumber(phone);

			const findUser = await this.userService.findByPhone(formatPhone);
			if (!findUser.success) return findUser;

			const { data } = findUser;
			
			const findAuthCode = await this.authCodeRepository.findOne({
				where: {
					user_id: data.id,
					code: code
				}
			});

			if (!findAuthCode) return { success: false, error: 'Код не верный'};
			// Делаем проверку на дату создания 

			const time_create = new Date(findAuthCode.createdAt).getTime();
			const differences = time_create - new Date().getTime();
			const diffInMinutes = Math.floor(differences / (1000 * 60));

			if (diffInMinutes < -5) {
				await findAuthCode.destroy();
				return { success: false, error: ' Время подтверждения превысило лимит в 5 минут, после отправки.' }
			}

			await findAuthCode.destroy();

			const token = await this.generateToken(data);

			return { data: { token, user: data }, success: true };
		} catch (err) {
			console.error(err);
			return { success: false, error: err.message }
		}
	}

}
