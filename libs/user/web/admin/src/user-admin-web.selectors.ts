import { createSelector } from 'reselect';
import parsePhoneNumber from 'libphonenumber-js';

import { RootState } from '@dx/store-web';
import { UserAdminStateType } from './user-admin-web.types';

const getUser = (state: RootState): UserAdminStateType['user'] => state.userAdmin.user;
const getUsers = (state: RootState): UserAdminStateType['users'] => state.userAdmin.users;

export const selectUserFormatted = createSelector(
  [getUser],
  (user) => {
    user?.phones.forEach((phone) => {
      const formatted = parsePhoneNumber(phone.phoneFormatted);
      phone.uiFormatted = formatted?.formatNational();
    });

    return user;
  }
);

export const selectUsersFormatted = createSelector(
  [getUsers],
  (users) => {
    users.forEach((user) => {
      user.phones.forEach((phone) => {
        const formatted = parsePhoneNumber(phone.phoneFormatted);
        phone.uiFormatted = formatted?.formatNational();
      });
    });

    return users;
  }
);
