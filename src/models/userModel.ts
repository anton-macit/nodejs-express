import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { TodoModel } from "./todoModel";
import { sequelize } from "./sequlized";

export class UserModel extends Model<
  InferAttributes<UserModel, { omit: "todos" }>,
  InferCreationAttributes<UserModel, { omit: "todos" }>
> {
  declare id: CreationOptional<string>;

  declare username: CreationOptional<string>;

  declare hash: CreationOptional<string>;

  declare todos?: NonAttribute<TodoModel[]>;

  declare getTodos: HasManyGetAssociationsMixin<TodoModel>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "users" },
);
