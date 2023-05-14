import { Model, Column, DataType, Table, ForeignKey } from "sequelize-typescript";
import { Stage } from "./stage.model";
import { Dishes } from "src/dishes/dishes.model";

@Table({tableName: 'stage_dishes', createdAt: false, updatedAt: false})
export class StageDishes extends Model<StageDishes> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Stage)
    @Column({type: DataType.INTEGER})
    stage_id: number;    

    @ForeignKey(() => Dishes)
    @Column({type: DataType.INTEGER})
    dishes_id: number;
}