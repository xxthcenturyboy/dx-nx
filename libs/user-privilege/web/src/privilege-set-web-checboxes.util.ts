import {
  UserRoleUi,
  UserType
} from '@dx/user-shared';
import {
  PrivilegeSetDataType,
  USER_ROLE
} from '@dx/user-privilege-shared';

const getSetNameArray = (privilegeSets: PrivilegeSetDataType[]): (keyof typeof USER_ROLE)[] => {
  return Array.from(privilegeSets, set => set.name);
};

export const userHasRole = (user: UserType, role: string): boolean => {
  if (user?.roles && Array.isArray(user.roles)) {
    return user.roles.indexOf(role) > -1;
  }

  return false;
};

export const prepareRoleCheckboxes = (
  privilegesets: PrivilegeSetDataType[],
  user: UserType
): UserRoleUi[] => {
  const setNames = getSetNameArray(privilegesets);
  const userRoles: UserRoleUi[] = [];

  for (const key of setNames) {
    if (key !== USER_ROLE.USER) {
      const thisRole = USER_ROLE[key];
      userRoles.push({
        role: thisRole,
        hasRole: userHasRole(user, thisRole)
      });
    }
  }

  return userRoles;
};
