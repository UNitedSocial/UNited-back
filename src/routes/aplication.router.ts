/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
import { userRoutes } from './user.routes'
// get all routes
const router: Router = express.Router()
router.use('/api', helloRoutes)
router.use('/api', groupsRoutes)
router.use('/api', groupsRoutes)
router.use('/api', userRoutes)

export const applicationRouter = router
