import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
import { userRoutes } from './user.routes'
import { searchRoutes } from './search.routes'
const router: Router = express.Router()

// Get all routes
router.use('/api', helloRoutes) // For testing new functionalities
router.use('/groups', groupsRoutes)
router.use('/users', userRoutes)
router.use('/search', searchRoutes)

export const applicationRouter = router
