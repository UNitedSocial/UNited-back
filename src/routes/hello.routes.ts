/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersMiddlewares from '../middlewares/usersMiddlewares'
import groupsMiddlewares from '../middlewares/groups.Middlewares'
const router = express.Router()

// Test Route
router.get('/CheckUser', usersMiddlewares.checkUserExist, (req, res) => res.send(`Hello World! ${req.body.user.nickname in [null, undefined] ? 'no username' : req.body.user.nickname as string}`))
router.get('/CheckGroup', groupsMiddlewares.checkGroupExist, (req, res) => res.send(`Hello World! ${req.body.group.info.name in [null, undefined] ? 'no username' : req.body.group.info.name as string}`))

export const helloRoutes: Router = router
