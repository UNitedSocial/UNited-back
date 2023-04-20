/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import searchControllers from '../controllers/search.controllers'
import testControllers from '../controllers/test.controllers'
const router = express.Router()

// Seach routes
router.get('/:query', searchControllers.getQuery) // Ruta de Obtención de Grupos

// Test route
router.get('/test/doomie', testControllers.doomie)

export const searchRoutes: Router = router
