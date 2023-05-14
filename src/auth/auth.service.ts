import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async loginCRM(email: string, password: string) {

		try {
			if (!email || !password)
				return { error: 'Пароль или логин некорректны', success: false };
				
			const user = await this.userService.getByEmail(email);
			
			if (!user)
				return { error: 'Пользователь не найден', success: false };

			if (user.role === Role.client)
				return { error: 'Клиент не имеет доступа в CRM систему', success: false };

			const passwordEquals = await bcrypt.compare(password, user.password);

			if (!passwordEquals)
				return { error: 'Некорректный пароль', success: false };


			const token = await this.generateToken(user);

			return {	data: { token, user }, success: true };

		} catch (err) {
			console.error(err);
			return { success: false, error: err.message };
		}
	}

	private async generateToken(user: User) {
		const payload = { email: user.email, id: user.id, roles: user.role, name: user.name, surname: user.surname } 
		return this.jwtService.sign(payload);
	}

}
