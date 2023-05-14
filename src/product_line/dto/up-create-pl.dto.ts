export class UpCreatePLDto {
	readonly id: number;
	readonly line_name: string;
	readonly count_dishes_min: number;
	readonly count_dishes_max: number;
	readonly price_one_dishes: number;
	readonly precent_range_discont: string;
	readonly status: string;
	readonly description: string;
}