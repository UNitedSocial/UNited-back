/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersMiddlewares from '../middlewares/usersMiddlewares'
import requestsControllers from '../controllers/requests.controllers'
import auth0Controllers from '../controllers/auth0.controllers'
const router = express.Router()

// Requests routes
router.post('/request', auth0Controllers.getUserData, usersMiddlewares.checkUserExist, requestsControllers.createRequest)// Ruta para crear una solicitud

export const requestRoutes: Router = router
