import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageStatus } from 'src/enums';

@Controller('stage')
export class StageController {
	constructor(private stageService: StageService) {}

	@Get('/get_all/:page/:limit/:status')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
		@Param('status', new DefaultValuePipe(StageStatus.kitchen), ParseIntPipe) status: number
	) {
		const { data, total, success } = await this.stageService.findAll(page, limit, status);
		return { data, total, success, page, limit};
	}

	@Get('/get_all_banned/:page/:limit/:status')
	async findAllBanned(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
		@Param('status', new DefaultValuePipe(StageStatus.kitchen), ParseIntPipe) status: number
	) {
		const { data, total, success } = await this.stageService.findAllBanned(page, limit, status);
		return { data, total, success, page, limit};
	}

	@Get('/to_delivery/:id')
	async toDelivery(@Param('id') id: number) {
		return this.stageService.toDelivery(id);
	}

	@Get('/to_complited/:id')
	async toComplited(@Param('id') id: number) {
		return this.stageService.toComplited(id);
	}
}
