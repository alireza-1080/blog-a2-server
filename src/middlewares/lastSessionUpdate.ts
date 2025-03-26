declare module 'express-session' {
  interface SessionData {
    lastVisit?: number;
  }
}

import { Request, Response, NextFunction } from 'express-serve-static-core'

const lastSessionUpdate = (req: Request, _res: Response, next: NextFunction) => {
  req.session.lastVisit = Date.now()
  next()
}

export default lastSessionUpdate
