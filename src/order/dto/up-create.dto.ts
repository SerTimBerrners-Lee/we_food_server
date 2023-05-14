export class UpCreateOrderDto {
	readonly id: number;
	readonly date_range: string;
	readonly address: string;
	readonly payment_state: string;
	readonly payment_method: string;
	readonly processing: string;
	readonly status: string;
	readonly description: string;
	readonly user_number: string;
	readonly product_line_id: number;
	readonly devide_by: number;
}
