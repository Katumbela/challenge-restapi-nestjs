import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';

@Injectable()
export class CsrfExcludeMiddleware implements NestMiddleware {
  private csrfProtection;

  constructor() {
    this.csrfProtection = csurf({ cookie: true });
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/auth/login') {
      return next();
    }
    return this.csrfProtection(req, res, next);
  }
}
