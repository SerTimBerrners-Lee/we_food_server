import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { UpCreateDishesDto } from './dto/up-create.dtp';

@Controller('dishes')
export class DishesController {
	constructor(private dishesService: DishesService) {}

	@Post('/create')
	create(@Body() dto: UpCreateDishesDto) {
		return this.dishesService.create(dto);
	}

	@Put('/update')
	update(@Body() dto: UpCreateDishesDto) {
		return this.dishesService.update(dto);
	}

	@Get('/get_one/:dishes_id')
	findOne(@Param('dishes_id') dishes_id: number) {
		return this.dishesService.findOne(dishes_id);
	}

	@Get('/get_all/:page/:limit')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.dishesService.findAll(page, limit);
		return { data, total, success, page, limit};
	}

	@Get('/get_all_banned/:page/:limit')
	async findAllBanned(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.dishesService.findAllBanned(page, limit);
		return { data, total, success, page, limit};
	}

	@Delete("/:dishes_id")
	toggleBan(@Param('dishes_id') dishes_id: number) {
		return this.dishesService.toggleBan(dishes_id);
	}

}
