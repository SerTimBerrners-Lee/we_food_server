import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BidService } from './bid.service';

@Controller('bid')
export class BidController {
	constructor(private bidService: BidService) {}

	@Get('/request_call/:phone')
	requestCall(@Param('phone') phone: string) {
		return this.bidService.requestCall(phone);
	}

	@Get('/get_all/:page/:limit')
	async findAll(
		@Param('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Param('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number
	) {
		const { data, total, success } = await this.bidService.findAll(page, limit);
		return { data, total, success, page, limit};
	}
}
