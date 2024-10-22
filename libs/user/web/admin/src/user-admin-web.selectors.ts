import { createSelector } from 'reselect';
import parsePhoneNumber from 'libphonenumber-js';

import type { RootState } from '@dx/store-web';
import type { PhoneType } from '@dx/phone-shared';
import type { UserType } from '@dx/user-shared';
import type { UserAdminStateType } from './user-admin-web.types';
import { UserAdminWebListService } from './user-admin-web-list.service';

const getUser = (state: RootState): UserAdminStateType['user'] => state.userAdmin.user;
const getUsers = (state: RootState): UserAdminStateType['users'] => state.userAdmin.users;

export const selectUserFormatted = createSelector(
  [getUser],
  (user) => {
    if (user) {
      const nextPhones: PhoneType[] = [];
      for (const phone of user.phones) {
        const formatted = parsePhoneNumber(phone.phoneFormatted);
        nextPhones.push({
          ...phone,
          uiFormatted: formatted?.formatNational()
        });
      }
      return {
        ...user,
        phones: nextPhones
      };
    }

    return user;
  }
);

export const selectUsersFormatted = createSelector(
  [getUsers],
  (users) => {
    const nextUsers: UserType[] = [];
    for (const user of users) {
      const nextPhones: PhoneType[] = [];
      for (const phone of user.phones) {
        const formatted = parsePhoneNumber(phone.phoneFormatted);
        nextPhones.push({
          ...phone,
          uiFormatted: formatted?.formatNational()
        });
      }
      nextUsers.push({
        ...user,
        phones: nextPhones
      });
    }

    return nextUsers;
  }
);

export const selectUsersListData = createSelector(
  [selectUsersFormatted],
  (users) => {
    const service = new UserAdminWebListService();
    return service.getRows(users);
  }
);
