import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpCreateOrderDto } from './dto/up-create.dto';

@Controller('order')
export class OrderController {
	constructor(private orderService: OrderService) {}

	@Post('/create')
	create(@Body() dto: UpCreateOrderDto) {
		return this.orderService.create(dto);
	}

	@Put('/update')
	update(@Body() dto: UpCreateOrderDto) {
		return this.orderService.update(dto);
	}

	@Get('/get_one/:order_id')
	findOne(@Param('order_id') order_id: number) {
		return this.orderService.findOne(order_id);
	}

	@Get('/get_all/:page/:limit')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.orderService.findAll(page, limit);
		return { data, total, success, page, limit};
	}

	@Get('/get_all_banned/:page/:limit')
	async findAllBanned(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.orderService.findAllBanned(page, limit);
		return { data, total, success, page, limit};
	}

	@Delete("/:order_id")
	toggleBan(@Param('order_id') order_id: number) {
		return this.orderService.toggleBan(order_id);
	}
}
