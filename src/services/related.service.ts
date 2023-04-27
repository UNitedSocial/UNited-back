import GroupModel from '../models/Group.model'
import { GroupDocument, GroupInfo } from '../models/group.documents'

interface RelatedGroup {
  // object with the group info, the topics that are related to it and the number of coincidences
  group: GroupInfo
  topics: [String]
  count: number
}

class RelatedService {
  public async getBestRelatedGroups (topics: String[], groupName: string = '', n: number = 5, offset: number = 0): Promise<RelatedGroup[] | undefined> {
    // get all related groups
    const allRelated = await this.obtainAllRelatedGroups(topics, groupName)
      .catch((err): null => {
        console.log('Error obtaining related groups', err.message)
        return null
      })
    // sort them by count (first the most coincidences)
    const bestRelated = allRelated?.sort((a, b) => {
      return b.count - a.count
    })
    // return the best n groups with an offset
    if (bestRelated === undefined) return undefined
    return bestRelated.slice(offset, offset + n)
  }

  public async obtainAllRelatedGroups (topics: String[], groupName: String = ''): Promise<RelatedGroup[]> {
    // create a dictionary with the groups and the topics that are related to them
    const dict = new Map<String, RelatedGroup>()
    // iterate over all topics
    for (const topic of topics) {
      // select all groups that have the topic
      await this.hasTopic(topic, groupName)
        .then((groups) => {
          // iterate over all groups that have the topic
          groups?.forEach((group) => {
            // if the group is already in the dictionary, add the topic to the list of topics and increase the count
            if (dict.has(group.name)) {
              const obtainGroup = dict.get(group.name)
              if (obtainGroup !== undefined) {
                obtainGroup.topics.push(topic)
                obtainGroup.count += 1
              }
              // if the group is not in the dictionary, add it to the dictionary
            } else {
              dict.set(group.name, { group, topics: [topic], count: 1 })
            }
          })
        })
        .catch((err): void => {
          console.log('Error finding related groups', err.message)
        })
    }
    // return the dictionary as a list
    const listDict = Array.from(dict.values())
    console.log('related to', groupName, listDict.map((group: RelatedGroup) => {
      return group.group.name + ' - ' + group.count.toString() + ' - ' + group.topics.join(', ')
    }
    ))
    return listDict
  }

  public async hasTopic (topic: String, groupName: String = ''): Promise<GroupInfo[] | null> {
    // select all groups that have the topic
    const groups = await GroupModel.find({
      'info.topics': topic,
      // do not obtain the group itself
      'info.name': { $ne: groupName }
    }, 'info', { _id: 0, __v: 0 })
      .then((groups: GroupDocument[]) => {
        // return the info of the groups
        return groups.map((group) => {
          return group.info
        })
      })
      .catch((err): void => {
        console.log('Error finding related groups', err.message)
      })
    return groups === undefined ? null : groups
  }
}

export default new RelatedService()
