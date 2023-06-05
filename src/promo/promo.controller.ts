import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { PromoService } from './promo.service';
import { UpCreatePromoDto } from './dto/UpCreatePromo.dto';

@Controller('promo')
export class PromoController {
	constructor(private promoService: PromoService) {}

	@Get('/get_all')
	findAll() {
		return this.promoService.findAll();
	}

	@Post('create')
	create(@Body() dto: UpCreatePromoDto) {
		return this.promoService.create(dto);
	}

	@Put('update')
	update(@Body() dto: UpCreatePromoDto) {
		return this.promoService.update(dto);
	}
}
