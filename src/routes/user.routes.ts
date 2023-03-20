/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersControllers from '../controllers/users.controllers'
const router = express.Router()
// groups routes
router.get('/users', usersControllers.index)
router.post('/user', usersControllers.createUser)
router.get('/usert', usersControllers.user)
router.delete('/userd', usersControllers.logOutGroup)
export const userRoutes: Router = router
