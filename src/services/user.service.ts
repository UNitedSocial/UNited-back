import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'

class USerService {
  public async userExists (username: string): Promise<boolean> {
    // check if user exist
    const user = await UserModel.findOne({ username })
      .catch((err) => {
        console.log(err)
        return false
      })

    if (user != null) {
      return true
    } else {
      return false
    }
  }

  public async isWebmaster (username: string): Promise<boolean | null> {
    const userDoc: UserDocument | null = await UserModel.findOne({ username })
      .catch((error: Error) => {
        // return null to handle error in the middleware
        console.log(error.message)
        return null
      })
    // if user is not defined
    if (userDoc == null) return null
    // if user is not webmaster (isMaster is optional)
    if (userDoc.isMaster === undefined || userDoc.isMaster === null || !userDoc.isMaster) return false
    return true
  }
}

export default new USerService()
