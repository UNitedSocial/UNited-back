/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersControllers from '../controllers/users.controllers'
const router = express.Router()

// Users routes
router.get('/users', usersControllers.index)// Ruta de Obtención de Usuarios
router.get('/seeUser/:username', usersControllers.userInfo) // Ruta de Obtención de información un usuario
router.post('/user', usersControllers.createUser) // Ruta de Creacion de Usuario
router.delete('/userd', usersControllers.logOutGroup)

// Test route
router.get('/doomie', usersControllers.doomie)

export const userRoutes: Router = router