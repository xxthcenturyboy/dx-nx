import { Request } from 'express';

export class HeaderService {
  public static getTokenFromAuthHeader(req: Request) {
    let token: string;

    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split('Bearer ')[1];
    }

    return token;
  }
}
