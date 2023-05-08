/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import auth0Middlewares from '../middlewares/auth0.middlewares'
import usersMiddlewares from '../middlewares/users.middlewares'
import testControllers from '../controllers/test.controllers'
import reportControllers from '../controllers/reports.controllers'
import webmastersControllers from '../controllers/webmasters.controllers'

const router = express.Router()

// Report routes
router.post('/', auth0Middlewares.getUserData, reportControllers.createReport) // Route to create a report

// Webmaster routes
router.get('/', usersMiddlewares.checkWebmasterRole, webmastersControllers.getReports) // Route to get all reports of the system
router.post('/state/:description', usersMiddlewares.checkWebmasterRole, webmastersControllers.stateReports) // Route to answer a report and inform user

// Test route
router.get('/test/doomie', testControllers.doomie)

export const reportsRoutes: Router = router
