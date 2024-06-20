import * as Express from 'express';

interface SessionData {
  userId?: string;
  refreshToken?: string;
  redirectTo?: string;
  cancelUrl?: string;
  referralToken?: string;
  oauthRequestToken?: undefined;
  oauthRequestTokenSecret?: undefined;
  destroy?: (function);
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    refreshToken?: string;
    redirectTo?: string;
    cancelUrl?: string;
    referralToken?: string;
    oauthRequestToken?: undefined;
    oauthRequestTokenSecret?: undefined;
  }
}

// TODO: Move to index.d.ts or global.d.ts.
declare global {
  namespace Express {
    interface Request {
      session: SessionData;
      sessionId: string;
    }
  }
}
