import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpCreateUserDto } from './dto/up-create-user.dto';

@Controller('user')
export class UserController {
	constructor(
		private userService:	UserService
	) {}

	@Post('/create')
	crateUser(@Body() dto: UpCreateUserDto) {
		return this.userService.createUser(dto);
	}

	@Put('/update')
	update(@Body() dto: UpCreateUserDto) {
		return this.userService.update(dto);
	}

	@Get('/get_one/:user_id')
	findOne(@Param('user_id') user_id: number) {
		return this.userService.findOne(user_id);
	}

	@Get('/get_all/:page/:limit')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.userService.findAll(page, limit);
		return { data, total, success, page, limit};
	}

	@Get('/get_all_banned/:page/:limit')
	async findAllBanned(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.userService.findAllBanned(page, limit);
		return { data, total, success, page, limit};
	}

	@Delete("/:user_id")
	userBan(@Param('user_id') user_id: number) {
		return this.userService.userToggleBan(user_id);
	}
}
