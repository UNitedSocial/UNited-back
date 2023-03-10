/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import groupsControllers from '../controllers/groups.controllers'
import dbconection from '../middlewares/dbconection'
const router = express.Router()
// groups routes
router.get('/groups', dbconection.connectdb, groupsControllers.index)
router.post('/group', dbconection.connectdb, groupsControllers.createGroup)
// test route
router.get('/doomie', dbconection.connectdb, groupsControllers.doomie)

export const groupsRoutes: Router = router
