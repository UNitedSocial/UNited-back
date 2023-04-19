/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import searchControllers from '../controllers/search.controllers'
const router = express.Router()

// Seach routes
// router.get('/', searchControllers.getUsers)

// Test route
router.get('/doomie', searchControllers.doomie)

export const searchRoutes: Router = router
