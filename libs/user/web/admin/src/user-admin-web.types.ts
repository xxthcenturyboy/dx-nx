import { EmailType } from "@dx/email-shared";
import { PhoneType } from "@dx/phone-shared";

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

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  emails: EmailType[];
  phones: PhoneType[];
  optInBeta: boolean;
  roles: string[];
  username: string;
  restrictions: string[];
};
