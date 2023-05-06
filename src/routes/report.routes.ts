/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
// import aut0Controllers from '../controllers/auth0.controllers'
import testControllers from '../controllers/test.controllers'
import reportControllers from '../controllers/reports.controllers'
const router = express.Router()

// Report routes
router.post('/', /* aut0Controllers.getUserData, */ reportControllers.createReport) // Route to get groups using search engine

// Test route
router.get('/test/doomie', testControllers.doomie)

export const reportRoutes: Router = router
