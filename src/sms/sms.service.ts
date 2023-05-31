import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData = require('form-data');
import { Role } from 'src/enums';

@Injectable()
export class SmsService {
	constructor() {
		console.log('\n\n\n');
		console.log('SmsService');
		console.log('\n\n\n');

		this.email = 'david.perov60@gmail.com';
		this.password = 'david.perov60@gmail.com';

		this.getToken();
	}
	private token: string;
	private email: string;
	private password: string;

	async getToken() {
		try {
			if (this.token) return this.token;

			const params = new URLSearchParams();
			params.append('email', this.email);
			params.append('pass', this.password);

			const response = await axios.post('https://smsgateway24.com/getdata/gettoken',
				params.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			
			if (response.data.error === 0) {
				this.token = response.data.token;
				console.log("SMS token: ", this.token);
				return this.token;
			} else {
				console.error(response.data.message);
				return false;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async sendSMS(phoneNumbers: string, message: string, deviceId = 10924, timeToSend = null, sim = null, customerId = null, urgent = 1) {
		try {

			const form = new FormData();

			form.append('token', this.token);
			form.append('sendto', phoneNumbers);
			form.append('body', message);
			form.append('device_id', deviceId);
			form.append('urgent', urgent);

			// Необязательные параметры
			if (timeToSend)
				form.append('timetosend', timeToSend);
			if (sim)
				form.append('sim', sim);
			if (customerId)
				form.append('customerid', customerId);

			const response = await axios.post('https://smsgateway24.com/getdata/addsms', form, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			
			if (response.data.error === 0) {
				return response.data.sms_id;
			} else {
				console.error("response.data.message: ", response.data.message);
				return false;
			}
		} catch (error) {
			console.error('Ошибка при отправке SMS: ' + error);
			return false;
		}
	}

	async addContactWithTags(fullName: string, phone: string, tagId: string = Role.client) {
		try {
			const params = new URLSearchParams();
			params.append('token', this.token);
			params.append('fullname', fullName);
			params.append('phone', phone);
			params.append('tag_id', tagId);
	
			const response = await axios.post('https://smsgateway24.com/getdata/savecontact', params.toString(), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
	
			if (response.data.error === 0) {
				const contactId = response.data.contact_id;
				console.log('Contact added successfully. Contact ID:', contactId);
				return contactId;
			} else {
				console.error(response.data.message);
				return false;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	}

}
