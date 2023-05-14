import { Data } from "ejs";
import { Column, DataType, Table, Model } from "sequelize-typescript";
import { StatusBid } from "src/enums";

@Table({tableName: 'bid'})
export class Bid extends Model<Bid> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: true })
	phone: string;

	@Column({type: DataType.STRING, defaultValue: StatusBid.open })
	status: string;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;

	@Column({type: DataType.DATE })
	last_call: Data;
}
