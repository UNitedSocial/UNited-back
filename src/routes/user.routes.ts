/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersControllers from '../controllers/users.controllers'
const router = express.Router()

// Users routes
router.get('/', usersControllers.getUsers)// Ruta de Obtención de Usuarios
router.get('/seeUser/:username', usersControllers.userInfo) // Ruta de Obtención de información un usuario
router.post('/createUser', usersControllers.createUser) // Ruta de Creacion de Usuario
router.delete('/quitGroup', usersControllers.quitGroup) // Ruta de Eliminación de Usuario

// Test route
router.get('/doomie', usersControllers.doomie)

export const userRoutes: Router = router
