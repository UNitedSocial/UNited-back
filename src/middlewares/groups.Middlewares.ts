import { Request, Response, NextFunction } from 'express'
import groupsService from '../services/groups.service'
import { Role } from '../models/group.documents'

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
    const username = user?.username
    if (groupName === undefined || username === undefined) {
      res.status(400).json({ message: 'Missing group name or username' })
      console.log('Missing group name or username')
      return
    }
    const role: null | String = await groupsService.getGroupRole(groupName, username)
    if (role === Role.editor) {
      next()
    } else if (role === Role.member) {
      res.status(400).json({ message: 'User isn\'t an editor' })
      console.log('User isn\'t an editor')
    } else if (role === 'not belongs') {
      res.status(400).json({ message: 'User doesn\'t belong to group' })
      console.log('User doesn\'t belong to group')
    } else {
      res.status(500).json({ message: 'error' })
      console.log('error')
    }
  }
}

export default new GroupMiddlewares()
