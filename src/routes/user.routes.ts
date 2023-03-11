/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersControllers from '../controllers/users.controllers'
import dbconection from '../middlewares/dbconection'
const router = express.Router()
// groups routes
router.get('/users', dbconection.connectdb, usersControllers.index)
router.post('/user', dbconection.connectdb, usersControllers.createUser)
router.get('/usert', dbconection.connectdb, usersControllers.user)

export const userRoutes: Router = router
