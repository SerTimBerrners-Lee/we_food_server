import { All, Body, Controller, Next, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuth } from './jwt-auth.guard';

@Controller('/')
export class AuthController {

	constructor(private authService: AuthService) {}

	@UseGuards(JwtAuth)
	@All('/*')
	all(@Next() next: any) {
			return next();
	}

	@Post('/login_crm')
	loginCRM(@Body() { email, password }) {
		return this.authService.loginCRM(email, password);
	}

}