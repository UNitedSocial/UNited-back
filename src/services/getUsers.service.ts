import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class GetUsers {
  public async getUsers (index: number, offset: number): Promise<Responses> {
    let response: Responses
    let users: UserDocument[] = []
    // Get groups
    try {
      users = await UserModel.find({}, { _id: 0, __v: 0 }, { skip: offset, limit: index })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding users'
      }
    }

    // Check if there are groups
    if (users.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There are no users to show'
      }
    } else {
      response = {
        answer: users,
        status: ResponseStatus.OK,
        message: 'Users found successfully'
      }
    }

    return response
  }
}

export default new GetUsers()
