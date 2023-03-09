import express, { Router } from 'express'
import { helloRoutes } from './hello.routes'
// import { usersRouter } from './users.router'

const router: Router = express.Router()
router.use('/api', helloRoutes)

export const applicationRouter = router
