import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
import { usersRoutes } from './users.routes'
import { searchRoutes } from './search.routes'
import { reportRoutes } from './report.routes'
const router: Router = express.Router()

// Get all routes
router.use('/api', helloRoutes) // For testing new functionalities
router.use('/groups', groupsRoutes)
router.use('/users', usersRoutes)
router.use('/search', searchRoutes)
router.use('/report', reportRoutes)

export const applicationRouter = router
