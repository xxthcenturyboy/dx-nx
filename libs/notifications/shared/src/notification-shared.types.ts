export type NotificationCreationParamTypes = {
  level: string;
  message: string;
  route?: string;
  suppressPush?: boolean;
  title?: string;
  userId: string;
};

export type NotificationType = {
  createdAt: Date;
  deletedAt?: Date;
  dismissedAt?: Date;
  id: string;
  lastReadDate?: Date;
  level: string;
  message: string;
  route?: string;
  suppressPush?: boolean;
  title: string;
  userId: string;
  viewed: boolean;
  viewedDate?: Date;
};
