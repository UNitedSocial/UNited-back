/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import groupsControllers from '../controllers/groups.controllers'
import usersMiddlewares from '../middlewares/usersMiddlewares'
const router = express.Router()
// groups routes
router.get('/groups', groupsControllers.index)
router.post('/group', usersMiddlewares.checkUserExist, groupsControllers.createGroup)
// test route
router.get('/doomie', groupsControllers.doomie)
router.get('/members', groupsControllers.members)

export const groupsRoutes: Router = router
