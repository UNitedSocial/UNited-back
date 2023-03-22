/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import groupsControllers from '../controllers/groups.controllers'
import usersMiddlewares from '../middlewares/usersMiddlewares'
const router = express.Router()

// Groups routes
router.get('/groups', groupsControllers.index) // Ruta de Obtención de Grupos
router.get('/seeGroup/:groupname', groupsControllers.groupInfo) // Ruta de Obtención de información un grupo
router.post('/group', usersMiddlewares.checkUserExist, groupsControllers.createGroup) // Ruta de Creacion de Grupo
router.get('/members', groupsControllers.members) // Ruta para obtener los miembros de un grupo

// Test route
router.get('/doomie', groupsControllers.doomie)

export const groupsRoutes: Router = router
