/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
// import aut0Controllers from '../controllers/auth0.controllers'
import testControllers from '../controllers/test.controllers'
import reportControllers from '../controllers/reports.controllers'
import webmastersControllers from '../controllers/webmasters.controllers'
const router = express.Router()

// Report routes
router.post('/', /* aut0Controllers.getUserData, */ reportControllers.createReport) // Route to get groups using search engine

// Webmaster routes
router.get('/', /* aut0Controllers.checkWebmaster, */ webmastersControllers.getReports) // Route to get groups using search engine
router.post('/state/:description', /* aut0Controllers.checkWebmaster, */ webmastersControllers.stateReports) // Route to assign state and inform user

// Test route
router.get('/test/doomie', testControllers.doomie)

export const reportsRoutes: Router = router
