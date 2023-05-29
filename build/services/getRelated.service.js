"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Group_model_1 = __importDefault(require("../models/Group.model"));
class GetRelated {
    getRelated(topics, groupName = '', n = 5, offset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            // get all related groups
            const allRelated = yield this.obtainAllRelatedGroups(topics, groupName)
                .catch((err) => {
                console.log('Error obtaining related groups', err.message);
                return null;
            });
            // sort them by count (first the most coincidences)
            const bestRelated = allRelated === null || allRelated === void 0 ? void 0 : allRelated.sort((a, b) => {
                return b.count - a.count;
            });
            // return the best n groups with an offset
            if (bestRelated === undefined)
                return undefined;
            return bestRelated.slice(offset, offset + n);
        });
    }
    obtainAllRelatedGroups(topics, groupName = '') {
        return __awaiter(this, void 0, void 0, function* () {
            // create a dictionary with the groups and the topics that are related to them
            const dict = new Map();
            // iterate over all topics
            for (const topic of topics) {
                // select all groups that have the topic
                yield this.hasTopic(topic, groupName)
                    .then((groups) => {
                    // iterate over all groups that have the topic
                    groups === null || groups === void 0 ? void 0 : groups.forEach((group) => {
                        // if the group is already in the dictionary, add the topic to the list of topics and increase the count
                        if (dict.has(group.name)) {
                            const obtainGroup = dict.get(group.name);
                            if (obtainGroup !== undefined) {
                                obtainGroup.topics.push(topic);
                                obtainGroup.count += 1;
                            }
                            // if the group is not in the dictionary, add it to the dictionary
                        }
                        else {
                            dict.set(group.name, { group, topics: [topic], count: 1 });
                        }
                    });
                })
                    .catch((err) => {
                    console.log('Error finding related groups', err.message);
                });
            }
            // return the dictionary as a list
            const listDict = Array.from(dict.values());
            console.log('related to', groupName, listDict.map((group) => {
                return group.group.name + ' - ' + group.count.toString() + ' - ' + group.topics.join(', ');
            }));
            return listDict;
        });
    }
    hasTopic(topic, groupName = '') {
        return __awaiter(this, void 0, void 0, function* () {
            // select all groups that have the topic
            const groups = yield Group_model_1.default.find({
                'info.topics': topic,
                // do not obtain the group itself
                'info.name': { $ne: groupName }
            }, 'info', { _id: 0, __v: 0 })
                .then((groups) => {
                // return the info of the groups
                return groups.map((group) => {
                    return group.info;
                });
            })
                .catch((err) => {
                console.log('Error finding related groups', err.message);
            });
            return groups === undefined ? null : groups;
        });
    }
}
exports.default = new GetRelated();
