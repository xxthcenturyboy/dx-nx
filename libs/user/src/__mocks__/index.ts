import { Model } from "sequelize-typescript";

export class UserModel extends Model<UserModel> {
  id: string;
}
