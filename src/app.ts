import cors from 'cors'
import mongoose from 'mongoose'
import express, { Application } from 'express'
import { applicationRouter } from './routes/aplication.router'

export class App {
  private readonly _app: Application

  constructor () {
    this._app = express()
    this.initMiddlewares()
    this.startConnection() // Call DB
  }

  // Initial middlewares
  private initMiddlewares (): void {
    this._app.use(cors())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    this._app.use(applicationRouter) // Call router
  }

  public get app (): Application {
    return this._app
  }

  // Connection to DB
  private startConnection (): void {
    mongoose.connect(process.env.CONECTIONSTRING as string, {})
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch((err) => {
        console.log('Error connecting to MongoDB', err.message)
      })
  }
}
