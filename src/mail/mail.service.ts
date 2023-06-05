import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendPasswordForNewUser(email: string, password: string, name: string) {
		
		await this.mailerService.sendMail({
			to: email,
			subject: "Добро пожаловать в команду!",
			template: './registrations',
			context: {
				name: name, 
				password: password,
				date_time: new Date().toLocaleString('ru-RU')
			}
		});

	}

	async sendUpdatePasswordForUser(email: string, password: string, name: string) {
		await this.mailerService.sendMail({
			to: email,
			subject: "Новый пароль",
			template: './update_password',
			context: {
				name: name, 
				password: password,
				date_time: new Date().toLocaleString('ru-RU')
			}
		});
	}

	async newBidRequest(phone: string, emails: any[]) {
		await this.mailerService.sendMail({
			to: emails,
			subject: "Новая заявка",
			template: './bid_request',
			context: {
				phone: phone,
				date_time: new Date().toLocaleString('ru-RU')
			}
		});
	}

	async createNewCient(phone: string, emails: any[]) {
		await this.mailerService.sendMail({
			to: emails,
			subject: "Новый пользователь был создан",
			template: './new_client',
			context: {
				phone: phone,
				date_time: new Date().toLocaleString('ru-RU')
			}
		});
	}
}
