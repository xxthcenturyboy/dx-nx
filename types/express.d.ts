import * as Express from 'express';
import {
  Fields,
  Files
} from 'formidable';
import { UserSessionType } from '../libs/user/api/src';


// interface SessionData {
//   userId?: string;
//   refreshToken?: string;
//   redirectTo?: string;
//   cancelUrl?: string;
//   referralToken?: string;
//   oauthRequestToken?: undefined;
//   oauthRequestTokenSecret?: undefined;
//   destroy?: (any) => void;
// }

// declare module 'express-session' {
//   interface SessionData {
//     userId?: string;
//     refreshToken?: string;
//     redirectTo?: string;
//     cancelUrl?: string;
//     referralToken?: string;
//     oauthRequestToken?: undefined;
//     oauthRequestTokenSecret?: undefined;
//   }
// }

// TODO: Move to index.d.ts or global.d.ts.
declare global {
  namespace Express {
    interface Request {
      // session: SessionData;
      // sessionId: string;
      uploads?: {
        fields?: Fields<string>,
        files?: Files<string>,
        err?: {
          httpCode?: number,
          message: string
        }
      },
      user?: UserSessionType
    }
  }
}
