import { NextFunction, Request, Response } from 'express';

export class AuthenticationHelper {
  static requireAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      return res.boom.unauthorized('ユーザー認証されていません');
    }

    next();
  }
}
