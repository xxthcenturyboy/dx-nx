import { Model } from 'sequelize-typescript';

import { USER_ROLE } from '@dx/user-privilege-api';

const mockUsers = {
  user1: {
    roles: [USER_ROLE?.SUPER_ADMIN, USER_ROLE?.ADMIN, USER_ROLE?.USER],
  },
  user2: {
    roles: [USER_ROLE?.ADMIN, USER_ROLE?.USER],
  },
  user3: {
    roles: [USER_ROLE?.USER],
  },
};

export { USER_ROLE } from '@dx/user-privilege-api';

export class UserModel extends Model<UserModel> {
  id: string;

  static async userHasRole(id: string, role: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = mockUsers[id];
      if (!user) {
        return reject('no user with this id');
      }

      return resolve(user.roles.indexOf(role) > -1);
    });
  }
}
