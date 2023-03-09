
import cors from 'cors'
import express, { Application } from 'express'
import { applicationRouter } from './routes/aplication.router'
import mongoose from 'mongoose'
// import helmet from 'helmet';

// import errorMiddleware from '@/middlewares/error.middleware';
// import helloRoutes from '@/routes/hello.routes';

export class App {
  private readonly _app: Application

  constructor () {
    this._app = express()
    this.initMiddlewares()
  }

  private initMiddlewares (): void {
    this._app.use(cors())
    // this._app.use(helmet())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))
    // this._app.use('/', helloRoutes)
    // this._app.use(errorMiddleware)
    this._app.use(applicationRouter)
    this.connectToDatabase()
  }

  public get app (): Application {
    return this._app
  }

  private connectToDatabase (): void {
    mongoose.connect(process.env.CONECTIONSTRING as string, {}).then(() => {
      console.log('Connected to MongoDB')
    }).catch((err) => {
      console.log('Error connecting to MongoDB', err)
    })

    mongoose.disconnect().then(() => {
      console.log('Disconnected from MongoDB')
    }).catch((err) => {
      console.log('Error disconnecting from MongoDB', err)
    })
  }
}
