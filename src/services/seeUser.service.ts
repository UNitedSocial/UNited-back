import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class SeeUser {
  public async seeUser (username: string): Promise<Responses> {
    let response: Responses
    let user: UserDocument | null = null
    // Get user
    try {
      user = await UserModel.findOne({ username }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user'
      }
    }

    // Check if user exists
    if (user === null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The User doesn\'t exist'
      }
    } else {
      response = {
        answer: user,
        status: ResponseStatus.OK,
        message: 'User found successfully'
      }
    }

    return response
  }
}

export default new SeeUser()
