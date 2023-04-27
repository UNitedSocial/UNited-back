/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import testControllers from '../controllers/test.controllers'
import aut0Controllers from '../controllers/auth0.controllers'
import usersMiddlewares from '../middlewares/users.middlewares'
import groupsMiddlewares from '../middlewares/groups.Middlewares'
import groupsControllers from '../controllers/groups.controllers'
import requestsControllers from '../controllers/requests.controllers'
const router = express.Router()

// Groups routes
router.get('/', groupsControllers.getGroups) // Route to get info of all groups
router.get('/seeGroup/:groupname', groupsControllers.groupInfo) // Route to get info of a group
router.post('/createGroup', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, groupsControllers.createGroup) // Route for create a group
router.get('/seeGroup/:groupname/members', groupsControllers.members) // Route to get the members of a group
router.put('/seeGroup/:groupname/changeRole', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, requestsControllers.changeRole) // Route to change role of a member

router.get('/seeGroup/:groupname/related', groupsControllers.related) // Route to get  groups related to a group
router.get('/new', groupsControllers.new) // Route to get most recent created groups
router.get('/popular', groupsControllers.popular) // Route to get most popular groups

// Requests routes
router.get('/seeGroup/:groupname/requests', requestsControllers.getRequests) // Route to get all join requests of a group
router.put('/seeGroup/:groupname/requests', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, groupsMiddlewares.checkGroupRole, requestsControllers.answerRequest) // Route to answer a join request
router.post('/seeGroup/:groupname/requests', aut0Controllers.getUserData, usersMiddlewares.checkUserExist, requestsControllers.createRequest) // Route to create a request to join a group

// Test route
router.get('/test/doomie', testControllers.doomie)

export const groupsRoutes: Router = router
