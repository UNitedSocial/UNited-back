/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import usersMiddlewares from '../middlewares/usersMiddlewares'
import testControllers from '../controllers/test.controllers'
import aut0Controllers from '../controllers/auth0.controllers'
import groupsControllers from '../controllers/groups.controllers'
import requestsControllers from '../controllers/requests.controllers'
import groupsMiddlewares from '../middlewares/groups.Middlewares'

const router = express.Router()
// Groups routes
router.get('/', groupsControllers.getGroups) // Ruta de Obtención de Grupos
router.get('/seeGroup/:groupname', groupsControllers.groupInfo) // Ruta de Obtención de información un grupo
router.get('/seeGroup/:groupname/members', groupsControllers.members) // Ruta para obtener los miembros de un grupo
router.post('/createGroup', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, groupsControllers.createGroup) // Ruta de Creacion de Grupo
router.get('/seeGroup/:groupname/related', groupsControllers.related) // Ruta para obtener las solicitudes de un grupo
router.put('/seeGroup/:groupname/changeRole', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, requestsControllers.changeRole)// Ruta para cambiar el rol de un usuario

// Requests routes
router.get('/seeGroup/:groupname/requests', requestsControllers.getRequests) // Ruta para obtener todas las solicitudes
router.post('/seeGroup/:groupname/sendRequest', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, requestsControllers.createRequest)// Ruta para crear una solicitud

// Test route
router.get('/test/doomie', testControllers.doomie)

export const groupsRoutes: Router = router
