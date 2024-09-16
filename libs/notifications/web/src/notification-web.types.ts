import { NotificationType } from "@dx/notifications-shared";

export type NotificationStateType = {
  system: NotificationType[];
  user: NotificationType[];
};
