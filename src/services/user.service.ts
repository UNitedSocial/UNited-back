import UserModel from '../models/User.model'
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
}

export default new USerService()
