import { Column, DataType, Table, Model } from "sequelize-typescript";

@Table({tableName: 'promo'})
export class Promo extends Model<Promo> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: false })
	name: string;

	@Column({type: DataType.DATE, allowNull: true })
	max_date_actions: Date;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;
}
