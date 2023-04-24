/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersMiddlewares from '../middlewares/users.middlewares'
import groupsMiddlewares from '../middlewares/groups.Middlewares'
const router = express.Router()

// Test Route
router.get('/CheckUser', usersMiddlewares.checkUserExist, (req, res) => res.send(`Hello World! ${req.body.user.nickname in [null, undefined] ? 'no username' : req.body.user.nickname as string}`))
router.get('/CheckGroup/:groupname', groupsMiddlewares.checkGroupRole, (_req, res) => res.send('Hello World!'))

export const helloRoutes: Router = router
