import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../models/response.documents'
import userService from '../services/user.service'

class CreateUser {
  public async createUser (user: UserDocument): Promise<Responses> {
    // Check if username is already taken
    let response: Responses
    const exist = await userService.userExists(user.username)
    if (exist) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Username already taken'
      }
      return response
    }

    // Create user and save it
    let newUser: UserDocument = new UserModel(user)
    try {
      newUser = await newUser.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating user'
      }
    }
    console.log(newUser)
    response = {
      status: ResponseStatus.CREATED,
      message: 'User created succesfully'
    }

    return response
  }
}

export default new CreateUser()
