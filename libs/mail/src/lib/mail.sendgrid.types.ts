export type SendgridSendOptionsType = {
  to: string;
  /* Defaults to noreply@domain.com */
  from?: string;
  subject: string;
  body: string;
  cta: string;
  ctaUrl: string;
  ctaTrack?: boolean;
  ipPoolName?: string;
  trackingSettings?: {
    clickTracking: {
      enable: boolean
    },
    openTracking: {
      enable: boolean
    }
  };
  customArgs?: any;
  unsubscribeGroup: string;
};
