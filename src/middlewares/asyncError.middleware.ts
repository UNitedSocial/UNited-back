import { NextFunction, Request, Response } from 'express'

export default (fn: (...args: any[]) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await Promise.resolve(fn(req, res, next)).catch(next)
  }
}
