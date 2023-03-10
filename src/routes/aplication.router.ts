/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
import { groupsRoutes } from './groups.routes'
// get all routes
const router: Router = express.Router()
router.use('/api/ping', helloRoutes)
router.use('/api', groupsRoutes)

export const applicationRouter = router
