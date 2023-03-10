/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import groupsControllers from '../controllers/groups.controllers'
import dbconection from '../middlewares/dbconection'
const router = express.Router()

router.get('/groups', dbconection.connectdb, groupsControllers.index)
router.post('/group', dbconection.connectdb, groupsControllers.createGroup)

export const groupsRoutes: Router = router
