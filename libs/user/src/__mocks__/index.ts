import { Model } from "sequelize-typescript";
import { USER_ROLE } from "../model/user.consts";

const mockUsers = {
  user1: {
    roles: [
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.USER
    ]
  },
  user2: {
    roles: [
      USER_ROLE.ADMIN,
      USER_ROLE.USER
    ]
  },
  user3: {
    roles: [
      USER_ROLE.USER
    ]
  }
};

export class UserModel extends Model<UserModel> {
  id: string;

  static async userHasRole(id: string, role: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = mockUsers[id];
      if (!user) {
        reject('no user with this id');
      }

      return user.roles.indexOf(role) > -1;
    });
  }
}
