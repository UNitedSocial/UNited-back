/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
import { userRoutes } from './user.routes'
import { requestRoutes } from './requests.routes'
const router: Router = express.Router()

// Get all routes
router.use('/api', helloRoutes)
router.use('/api', groupsRoutes)
router.use('/api', userRoutes)
router.use('/api', requestRoutes)

export const applicationRouter = router
