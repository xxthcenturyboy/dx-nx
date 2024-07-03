export type DevicesResponseType = {
  message: string;
};

export type DeviceType = {
  biomAuthPubKey: string;
  carrier: string;
  createdAt: Date;
  deletedAt: Date | null;
  deviceCountry: string;
  deviceId: string;
  facialAuthState: string;
  fcmToken: string;
  id: string;
  name: string;
  uniqueDeviceId: string;
  userId: string;
  verificationToken: string;
  verifiedAt: Date | null;
};

export type DeviceAuthType = {
  uniqueDeviceId: string;
  deviceId?: string;
  carrier?: string;
  deviceCountry?: string;
  name?: string;
  multiSigPubKey: string;
};
