import { Column, DataType, HasMany, Table, Model, AfterSync } from "sequelize-typescript";
import { Role } from "src/enums";
import * as bcrypt from 'bcryptjs';
import { Order } from "src/order/order.model";

@Table({tableName: 'users'})
export class User extends Model<User> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: true })
	name: string;

	@Column({type: DataType.STRING, allowNull: true })
	surname: string;

	@Column({type: DataType.INTEGER, defaultValue: 0 })
	discount: number;

	@Column({type: DataType.STRING, allowNull: true })
	birthday: string;
	
	@Column({type: DataType.DATE, allowNull: true })
	last_call: Date;

	@Column({type: DataType.STRING, allowNull: true })
	password: string;

	@Column({type: DataType.STRING, allowNull: false })
	phone: string;

	@Column({type: DataType.STRING, allowNull: true })
	address: string;

	@Column({type: DataType.STRING, allowNull: true })
	email: string;

	@Column({type: DataType.TEXT, allowNull: true })
	description: string;

	@Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
	ban: boolean;

	@Column({type: DataType.STRING, allowNull: true, defaultValue: Role.client })
	role: string;

	@HasMany(() => Order)
	orders: Order[]

	@AfterSync
	static async checkUser(sync: any) {
		const user = await sync.sequelize.models.User;
		if (!user) return;

		const allUser = await user.findAll();
		if (!allUser.length) {
			try {
				const hashPassword = await bcrypt.hash('54321', 5);
				await user.create({
					password: hashPassword,
					phone: '+37444156243',
					email: 'david.perov60@gmail.com',
					name: 'David',
					surname: 'Perov',
					role: Role.admin
				});
			} catch (err) {
				console.error(err);
			}
		}
	}

}
