/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
import { userRoutes } from './user.routes'
import { requestRoutes } from './requests.routes'
import { searchRoutes } from './search.routes'
const router: Router = express.Router()

// Get all routes
router.use('/api', helloRoutes)
router.use('/groups', groupsRoutes)
router.use('/users', userRoutes)
router.use('/search', searchRoutes)
router.use('/requests', requestRoutes)

export const applicationRouter = router
