import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import userService from '../services/user.service'

class CreateUser {
  public async createUser (user: UserDocument): Promise<Responses> {
    let response: Responses

    // Check if all info is provided
    if (user.username === undefined || user.name === undefined || user.email === undefined) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Missing user info'
      }
      return response
    }

    // Check if username is already taken
    const exist = await userService.userExists(user.username)
    if (exist) {
      // return user rol in web
      const username = user.username
      const userDoc = await UserModel.findOne({ username })
        .catch((err) => {
          console.log(err)
          return null
        })
      if (userDoc == null) {
        response = {
          status: ResponseStatus.INTERNAL_SERVER_ERROR,
          message: 'Error getting user',
          answer: { isMaster: false }
        }
        return response
      }
      const isMaster = userDoc?.isMaster
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Username already taken',
        answer: { isMaster }
      }
      return response
    }

    // Create user and save it
    const newUser: UserDocument = new UserModel(user)
    try {
      await newUser.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating user'
      }
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'User created succesfully',
      answer: { isMaster: false }
    }

    return response
  }
}

export default new CreateUser()
