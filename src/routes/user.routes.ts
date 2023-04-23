/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import testControllers from '../controllers/test.controllers'
import auth0Controllers from '../controllers/auth0.controllers'
import usersControllers from '../controllers/users.controllers'

const router = express.Router()

// Users routes
router.get('/', usersControllers.getUsers)// Route to get info of all users
router.get('/seeUser/:username', usersControllers.userInfo) // Route for get info of a user
router.post('/createUser', auth0Controllers.getUserData, usersControllers.createUser) // Rout for create a user
router.delete('/quitGroup', auth0Controllers.getUserData, usersControllers.quitGroup) // Rout for quit a group
router.get('/userStateGroup', usersControllers.userStateGroup) // Rout for get state of a user in a group

// Test route
router.get('/test/doomie', testControllers.doomie)

export const userRoutes: Router = router
