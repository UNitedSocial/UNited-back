/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
// import auth0Controllers from '../controllers/auth0.controllers'
import testControllers from '../controllers/test.controllers'
import usersControllers from '../controllers/users.controllers'
const router = express.Router()

// Users routes
router.post('/', /* auth0Controllers.getUserData, */ usersControllers.createUser) // Rout for create a user
router.get('/', usersControllers.getUsers) // Route to get info of all users
router.get('/:username', usersControllers.seeUser) // Route for get info of a user
router.put('/quitGroup', /* auth0Controllers.getUserData, */ usersControllers.quitGroup) // Route for quit a group
router.get('/userStateGroup', usersControllers.userStateGroup) // Rout for get state of a user in a group

// Test route
router.get('/test/doomie', testControllers.doomie)

export const usersRoutes: Router = router
