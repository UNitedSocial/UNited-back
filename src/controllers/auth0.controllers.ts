import { Request, Response, NextFunction } from 'express'
import { auth } from 'express-oauth2-jwt-bearer'

class Auth0Controller {
  public async doom (_req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.status(200).json({ message: 'Doomed' })
  }

  public verifyJwt = auth({
    audience: process.env.AUTH0AUDIENCE,
    issuerBaseURL: process.env.AUTH0DOMAIN,
    tokenSigningAlg: process.env.AUTH0ALGORITHM
  })

  public async getUserData (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.headers.authorization === undefined) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    const accessToken = req.headers.authorization?.split(' ')[1]

    fetch('https://dev-nj72nakbgyv4edeo.us.auth0.com/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken === undefined ? '' : accessToken}`
      }
    }).then(async (response) => {
      void response.json()?.then((data) => {
        req.body.user = data
        next()
      }).catch((err) => {
        res.status(500).json({ message: err.message })
      })
    }).catch((err) => {
      res.status(500).json({ message: err.message })
    })
  }
}

export default new Auth0Controller()
