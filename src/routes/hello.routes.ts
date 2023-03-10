import express, { Router } from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
  res.send('pong')
})

export const helloRoutes: Router = router
