/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import testControllers from '../controllers/test.controllers'
// import aut0Controllers from '../controllers/auth0.controllers'
// import usersMiddlewares from '../middlewares/users.middlewares'
// import groupsMiddlewares from '../middlewares/groups.Middlewares'
import groupsControllers from '../controllers/groups.controllers'
import requestsControllers from '../controllers/requests.controllers'
const router = express.Router()

// Group routes
router.get('/', groupsControllers.getGroups) // Route to get info of all groups
router.get('/:groupname', groupsControllers.seeGroup) // Route to get info of a group
router.get('/:groupname/members', groupsControllers.getMembers) // Route to get the members of a group
router.post('/', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist, */ groupsControllers.createGroup) // Route for create a group
router.put('/:groupname/changeRole', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist,  groupsMiddlewares.checkGroupRole, */ groupsControllers.changeRole) // Route to change role of a member

// Related, new and popular groups routes
router.get('/:groupname/related', groupsControllers.getRelated) // Route to get  groups related to a group
router.get('/:page/new', groupsControllers.getNew) // Route to get most recent created groups
router.get('/:page/popular', groupsControllers.getPopular) // Route to get most popular groups

// Requests routes
router.get('/:groupname/requests', requestsControllers.getRequests) // Route to get all join requests of a group
router.post('/:groupname/requests', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist, */ requestsControllers.createRequest) // Route to create a request to join a group
router.put('/:groupname/requests', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist,  groupsMiddlewares.checkGroupRole,  */ requestsControllers.answerRequest) // Route to answer a join request

// Sections routes
router.post('/:groupname/sections', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist,  groupsMiddlewares.checkGroupRole, */ groupsControllers.createSection) // Route to change role of a member
router.delete('/:groupname/sections', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist,  groupsMiddlewares.checkGroupRole, */ groupsControllers.deleteSection) // Route to change role of a member
router.put('/:groupname/sections', /* aut0Controllers.getUserData,  usersMiddlewares.checkUserExist,  groupsMiddlewares.checkGroupRole, */ groupsControllers.editSection) // Route to change role of a member

// Test route
router.get('/test/doomie', testControllers.doomie)

export const groupsRoutes: Router = router
