/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
// import auth0Middlewares from '../middlewares/auth0.middlewares'
import testControllers from '../controllers/test.controllers'
import usersControllers from '../controllers/users.controllers'
import reportsControllers from '../controllers/reports.controllers'
const router = express.Router()

// Users routes
router.post('/', /* auth0Middlewares.getUserData, */ usersControllers.createUser) // Route for create an user
router.get('/', usersControllers.getUsers) // Route to get info of all users
router.get('/:username', usersControllers.seeUser) // Route to get info of an specific user
router.delete('/:username', usersControllers.deleteUser) // Route to get info of an specific user
router.get('/:username/reports', reportsControllers.seeReports) // Route to get reports of an specicific user

// Test route
router.get('/test/doomie', testControllers.doomie)

export const usersRoutes: Router = router
