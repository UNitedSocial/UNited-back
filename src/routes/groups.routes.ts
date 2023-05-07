/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
// import aut0Controllers from '../controllers/auth0.controllers'
import usersMiddlewares from '../middlewares/users.middlewares'
import groupsMiddlewares from '../middlewares/groups.middlewares'
import testControllers from '../controllers/test.controllers'
import groupsControllers from '../controllers/groups.controllers'
import requestsControllers from '../controllers/requests.controllers'
import webmastersControllers from '../controllers/webmasters.controllers'
const router = express.Router()

// Group routes
router.post('/', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsControllers.createGroup) // Route for create a group
router.get('/', groupsControllers.getGroups) // Route to get info of all groups
router.get('/:groupname', groupsControllers.seeGroup) // Route to get info of an specific group
router.put('/:groupname', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, groupsControllers.editGroup) // Route to edit info of an specific group
router.get('/:groupname/members', groupsControllers.getMembers) // Route to get the members of an specific group
router.get('/:groupname/topics', groupsControllers.getTopics) // Route to get the members of an specific group
router.put('/:groupname/changeRole', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, groupsControllers.changeRole) // Route to change role of a member
router.put('/:groupname/quitGroup', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsControllers.quitGroup) // Route to change role of a member
router.get('/:groupname/:username', groupsControllers.userState) // Rout for get state of a user in a group

// Related, new and popular groups routes
router.get('/:groupname/related', groupsControllers.getRelated2) // Route to get groups related to an specific group
router.get('/:page/new', groupsControllers.getNew) // Route to get most recent created groups
router.get('/:page/popular', groupsControllers.getPopular) // Route to get most popular groups

// Sections routes
router.post('/:groupname/sections', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, groupsControllers.createSection) // Route to create a section in a group page
router.delete('/:groupname/sections', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, groupsControllers.deleteSection) // Route to delete a section of a group page
router.put('/:groupname/sections', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, groupsControllers.editSection) // Route to edit a section of a group page

// Requests routes
router.post('/:groupname/requests', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, requestsControllers.createRequest) // Route to create a request to join a group
router.get('/:groupname/requests', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, requestsControllers.getRequests) // Route to get all join requests of a group
router.put('/:groupname/requests', /* aut0Controllers.getUserData, */ usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, requestsControllers.answerRequest) // Route to answer a join request in a group

// Webmaster routes
router.delete('/:groupname', /* aut0Controllers.checkWebmaster, */ webmastersControllers.deleteGroup) // Route to delete a group

// Test route
router.get('/test/doomie', testControllers.doomie)

export const groupsRoutes: Router = router
