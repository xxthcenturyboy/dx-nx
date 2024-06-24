export {
  UserRoutes,
  UserRoutesType
} from './api/user.routes';
export { getUserProfileState } from './api/user-profile';
export {
  USER_ENTITY_POSTGRES_DB_NAME,
  USER_ROLE,
  USER_EMAIL_POSTGRES_DB_NAME,
  USER_PHONE_POSTGRES_DB_NAME,
  USER_PRIVILEGES_POSTGRES_DB_NAME
} from './model/user.consts';
export {
  UserModel,
  UserModelType,
} from './model/user.postgres-model';
export {
  UserEmailType,
  UserPhoneType,
  UserProfileStateType
} from './model/user.types';

/// email
export {
  UserEmailModel,
  UserEmailModelType
} from './model/user-email.postgres-model';

/// phone
export {
  UserPhoneModel,
  UserPhoneModelType
} from './model/user-phone.postgres-model';

/// privileges
export {
  UserPrivilegeSetModel,
  UserPrivilegeSetModelType,
} from './model/user-privilege.postgres-model';
