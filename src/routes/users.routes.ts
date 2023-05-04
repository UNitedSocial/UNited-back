/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import testControllers from '../controllers/test.controllers'
import usersControllers from '../controllers/users.controllers'
const router = express.Router()

// Users routes
router.post('/', /* aut0Controllers.getUserData, */ usersControllers.createUser) // Route for create a user
router.get('/', usersControllers.getUsers) // Route to get info of all users
router.get('/:username', usersControllers.seeUser) // Route for get info of a user

// Test route
router.get('/test/doomie', testControllers.doomie)

export const usersRoutes: Router = router
