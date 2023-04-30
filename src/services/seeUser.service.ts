import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class SeeUser {
  public async seeUser (username: string): Promise<Responses> {
    let response: Responses
    let user: UserDocument[] = []
    // Get groups
    try {
      user = await UserModel.find({ username }, { _id: 0, __v: 0 })
    } catch {
      response = {
        answer: user,
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user'
      }
    }

    // Check if there are groups
    if (user.length === 0) {
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
