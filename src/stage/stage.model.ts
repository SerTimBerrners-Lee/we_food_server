import { Column, DataType, Table, Model, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { Dishes } from "src/dishes/dishes.model";
import { StageStatus } from "src/enums";
import { Order } from "src/order/order.model";
import { User } from "src/user/user.model";
import { StageDishes } from "./stage-dishes.motel";

@Table({tableName: 'stage'})
export class Stage extends Model<Stage> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.INTEGER, defaultValue: StageStatus.kitchen })
	status: number;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;

	@Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
	ban: boolean;

	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	user_id: number;

	@BelongsTo(() => User)
	user: User;

	@ForeignKey(() => Order)
	@Column({type: DataType.INTEGER})
	order_id: number;

	@BelongsTo(() => Order)
	order: Order;

	@BelongsToMany(() => Dishes, () => StageDishes)
	dishes: Dishes[];

}
