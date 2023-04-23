
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

  private initMiddlewares (): void {
    // Initial middlewares
    this._app.use(cors())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    this._app.use(applicationRouter) // Call router
  }

  public get app (): Application {
    return this._app
  }

  // Conection to DB
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
