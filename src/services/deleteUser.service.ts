
import { Responses } from '../types/response.types'

class DeleteUser {
  public async deleteUser (_groupname: string): Promise<Responses> {
    const response: Responses = {
      status: 200,
      message: 'User deleted successfully'
    }

    return response
  }
}

export default new DeleteUser()
