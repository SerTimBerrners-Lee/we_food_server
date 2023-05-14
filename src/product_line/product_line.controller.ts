import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductLineService } from './product_line.service';
import { UpCreatePLDto } from './dto/up-create-pl.dto';

@Controller('product_line')
export class ProductLineController {
	constructor(
		private plService: ProductLineService
	) {}

	@Post('/create')
	create(@Body() dto: UpCreatePLDto) {
		return this.plService.create(dto);
	}

	@Put('/update')
	update(@Body() dto: UpCreatePLDto) {
		return this.plService.update(dto);
	}

	@Get('/get_all/:page/:limit')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.plService.findAll(page, limit);
		return { data, total, success, page, limit};
	}

	@Get('/get_all_banned/:page/:limit')
	async findAllBanned(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.plService.findAllBanned(page, limit);
		return { data, total, success, page, limit};
	}

	@Get("/get_one/:pl_id")
	getOne(@Param('pl_id') pl_id: number) {
		return this.plService.getOne(pl_id);
	}

	@Delete("/:pl_id")
	userBan(@Param('pl_id') pl_id: number) {
		return this.plService.userToggleBan(pl_id);
	}
}
