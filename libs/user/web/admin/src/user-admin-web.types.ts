import { UserType } from '@dx/user-shared';

export type UserAdminStateType = {
  filterValue?: string;
  lastRoute: string;
  limit: number;
  offset: number;
  orderBy?: string;
  sortDir: 'ASC' | 'DESC';
  user?: UserType;
  users: UserType[];
  usersCount?: number;
};
