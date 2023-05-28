import { Column, DataType, Table, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "src/user/user.model";

@Table({tableName: 'auth_code'})
export class AuthCode extends Model<AuthCode> {

	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING, allowNull: false })
	code: string;

    @ForeignKey(() => User)
	@Column({type: DataType.INTEGER})
	user_id: number;

	@BelongsTo(() => User)
	user: User;

}
