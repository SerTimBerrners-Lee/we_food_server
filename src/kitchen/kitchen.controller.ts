import { Controller, Get } from '@nestjs/common';
import { KitchenService } from './kitchen.service';

@Controller('kitchen')
export class KitchenController {
	constructor(
		private kitchenService: KitchenService
	) {}

	@Get('form_new_stage_today')
	formNewStageToday() {
		return this.kitchenService.formNewStagesToday();
	}
}
