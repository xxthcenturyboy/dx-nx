export const NOTIFICATION_LEVELS = {
  INFO: 'INFO',
  PRIMARY: 'PRIMARY',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
};

export const NOTIFICATION_ERRORS = {
  MISSING_PARAMS: '[NOTIFY] Missing Required Params.',
  MISSING_USER_ID: '[NOTIFY] User ID required to fetch Notifications by User ID.',
  SERVER_ERROR: '[NOTIFY] Server error in Notifications',
};

export const NOTIFICATION_SOCKET_NS = '/notify';
