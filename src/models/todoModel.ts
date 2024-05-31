import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./sequlized";
import { UserModel } from "./userModel";

export class TodoModel extends Model<
  InferAttributes<TodoModel>,
  InferCreationAttributes<TodoModel>
> {
  declare id: CreationOptional<string>;

  declare content: string | null;

  declare priority: number;

  declare userId: ForeignKey<UserModel["id"]>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

TodoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "todos" },
);

TodoModel.belongsTo(UserModel);
UserModel.hasMany(TodoModel, { foreignKey: "userId" });
