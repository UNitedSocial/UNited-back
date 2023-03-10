
import cors from 'cors'
import express, { Application } from 'express'
import { applicationRouter } from './routes/aplication.router'

export class App {
  private readonly _app: Application

  constructor () {
    this._app = express()
    this.initMiddlewares()
  }

  private initMiddlewares (): void {
    this._app.use(cors())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    // use routes
    this._app.use(applicationRouter)
  }

  public get app (): Application {
    return this._app
  }
}
