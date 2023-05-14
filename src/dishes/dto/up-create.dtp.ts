export class UpCreateDishesDto {
	readonly id: number;
	readonly name: string;
	readonly compound: IDishesCompound[];
	readonly type: string[];
	readonly calories: number;
	readonly proteins: number;
	readonly carbohydrates: number;
	readonly fast: number;
	readonly description: string;
}