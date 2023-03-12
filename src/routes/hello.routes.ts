/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersMiddlewares from '../middlewares/usersMiddlewares'

const router = express.Router()

router.get('/doomie', usersMiddlewares.checkUserExist, (req, res) => res.send(`Hello World! ${req.body.username in [null, undefined] ? 'no username' : req.body.username as string}`))

export const helloRoutes: Router = router
