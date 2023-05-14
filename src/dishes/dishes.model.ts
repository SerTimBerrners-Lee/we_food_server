import { DataTypes } from "sequelize";
import { Column, DataType, Table, Model } from "sequelize-typescript";

@Table({tableName: 'dishes'})
export class Dishes extends Model<Dishes> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: false })
	name: string;

	@Column({type: DataType.JSONB, allowNull: true })
	compound: IDishesCompound[];

	@Column({type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true })
	type: string[];

	@Column({type: DataType.INTEGER, allowNull: true })
	calories: number;

	@Column({type: DataType.INTEGER, allowNull: true })
	proteins: number;

	@Column({type: DataType.INTEGER, allowNull: true })
	carbohydrates: number;
	
	@Column({type: DataType.INTEGER, allowNull: true })
	fast: number;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;

	@Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
	ban: boolean;
}
