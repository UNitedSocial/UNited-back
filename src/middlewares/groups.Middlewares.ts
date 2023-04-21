import { Request, Response, NextFunction } from 'express'
import groupsService from '../services/groups.service'
class GroupMiddlewares {
  public async checkGroupExist (req: Request, res: Response, next: NextFunction): Promise<void> {
    // get and check username is given
    const { group } = req.body
    const groupName = group?.info.name
    if (groupName === undefined) {
      res.status(400).json({ message: 'Missing group name' })
      console.log('Missing group name')
      return
    }
    // check if user exist
    const groupExists = await groupsService.groupExists(groupName)
    if (groupExists) {
      next()
    } else {
      res.status(400).json({ message: 'Group do not exists' })
      console.log('Group do not exists')
    }
  }
}
export default new GroupMiddlewares()
