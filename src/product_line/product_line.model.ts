import { Column, DataType, Table, Model } from "sequelize-typescript";
import { StatusProductLine } from "src/enums";

@Table({tableName: 'product_line'})
export class ProductLine extends Model<ProductLine> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, unique: true, allowNull: false})
	line_name: string;

	@Column({type: DataType.INTEGER, allowNull: false})
	count_dishes_min: number;

	@Column({type: DataType.INTEGER, allowNull: false})
	count_dishes_max: number;

	@Column({type: DataType.INTEGER})
	price_one_dishes: number;

	@Column({type: DataType.TEXT, defaultValue: '[]'})
	precent_range_discont: string;

	@Column({type: DataType.STRING, defaultValue: StatusProductLine.not_revelant })
	status: string;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;
}
