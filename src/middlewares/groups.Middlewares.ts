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

  public async checkGroupRole (req: Request, res: Response, next: NextFunction): Promise<void> {
    const groupName = req.params.groupname
    const { user } = req.body
    const username = user?.nickname
    if (groupName === undefined || username === undefined) {
      res.status(400).json({ message: 'Missing group name or username' })
      console.log('Missing group name or username')
      return
    }
    const role = await groupsService.getGroupRole(groupName, username)
    if (role === 'admin') {
      next()
    } else {
      res.status(400).json({ message: 'User is not an admin' })
      console.log('User is not an admin')
    }
  }
}
export default new GroupMiddlewares()
