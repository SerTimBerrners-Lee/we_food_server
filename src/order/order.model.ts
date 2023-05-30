import { Column, DataType, ForeignKey, Table, Model, BelongsTo, HasMany } from "sequelize-typescript";
import { PaymentMethodOrder, PaymentStateOrder, ProcessingOrder, StatusOrder } from "src/enums";
import { ProductLine } from "src/product_line/product_line.model";
import { Stage } from "src/stage/stage.model";
import { User } from "src/user/user.model";

@Table({tableName: 'orders'})
export class Order extends Model<Order> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: true })
	date_range: string;

	@Column({type: DataType.STRING, allowNull: true })
	address: string;

	@Column({type: DataType.STRING, allowNull: true, defaultValue: PaymentStateOrder.not_paid })
	payment_state: string;

	@Column({type: DataType.STRING, allowNull: true, defaultValue: PaymentMethodOrder.cash })
	payment_method: string;

	@Column({type: DataType.STRING, allowNull: true, defaultValue: ProcessingOrder.not_confirmed })
	processing: string;

	@Column({type: DataType.STRING, allowNull: true, defaultValue: StatusOrder.in_work })
	status: string;

	@Column({type: DataType.INTEGER, allowNull: true, defaultValue: 2 })
	devide_by: number;

	@Column({type: DataType.INTEGER, allowNull: true })
	dishes_kolvo: number;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;

	@Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
	ban: boolean;

	@ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	user_id: number;

	@BelongsTo(() => User)
	user: User;

	@ForeignKey(() => ProductLine)
	@Column({type: DataType.INTEGER})
	product_line_id: number;

	@BelongsTo(() => ProductLine)
	product_line: ProductLine;

	@HasMany(() => Stage)
	stages: Stage[];
}
