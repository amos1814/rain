import { UPDATE_TEXT_OFFSET, UPDATE_TEXT_DURATION } from '../../game/constants';

export function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
};

export function updateItemInArray(array, itemId, updateItemCallback) {
  return array.map(item => {
    if (item.id !== itemId) return item
    return updateItemCallback(item);
  });
};

export function updatePositionInArray(array, type, position, updateItemCallback) {
  return array.map(item => {
    if (!(item.type === type && item.position === position)) return item
    return updateItemCallback(item);
  });
};

function compareObjects(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] !== b[propName]) return false;
  }
  return true;
}

export function mergeArrays(oldArray, newArray) {
  if (!newArray) return oldArray;
  let obj = {};
  for (let oldItem of oldArray) {
    obj[oldItem.id] = oldItem;
  };
  for (let newItem of newArray) {
    if (obj.hasOwnProperty(newItem.id)) {
      if (newItem.quantity === 0) {
        delete obj[newItem.id];
        break;
      } else if (newItem.health === 0 && !obj[newItem.id].hasOwnProperty('timestamp')) {
        obj[newItem.id] = Object.assign(obj[newItem.id], newItem, {
          timestamp: Date.now()
        });
      } else {
        obj[newItem.id] = Object.assign(obj[newItem.id], newItem);
      }
    } else {
      obj[newItem.id] = newItem;
    }
    if (newItem.hasOwnProperty('skill_changes') && newItem.skill_changes.length > 0) {
      obj[newItem.id] = Object.assign(obj[newItem.id], {
        skills: newItem.skills.map(skill => {
          const match = newItem.skill_changes.find(change => skill.id === change.id);
          if (match) {
            return Object.assign(skill, match);
          } else {
            return skill;
          }
        })
      });
    }
    if (newItem.hasOwnProperty('modifier_changes') && newItem.modifier_changes.length > 0) {
      obj[newItem.id] = Object.assign(obj[newItem.id], {
        modifiers: newItem.modifiers.map(modifier => {
          const match = newItem.modifier_changes.find(change => modifier.id === change.id);
          if (match) {
            return Object.assign(modifier, match);
          } else {
            return modifier;
          }
        })
      });
    }
  }
  // convert object of items into array of items
  let result = [];
  for(let prop in obj) {
    if(obj.hasOwnProperty(prop))
      result.push(obj[prop]);
  }
  return result;
};

function makeSlotKey(type, position) {
  return `${type},${position}`;
}

function getSlotProps({ type, position, xPos, yPos, width, height }) {
  if ([xPos, yPos, width, height].every(prop => prop !== undefined)) {
    return { type, position, xPos, yPos, width, height };
  } else {
    return { type, position };
  }
}

export function mergeSlots(oldArray, newArray) {
  if (!newArray) return oldArray;
  let obj = {};
  for (let oldItem of oldArray) {
    const key = makeSlotKey(oldItem.type, oldItem.position);
    obj[key] = oldItem;
  };
  let newObj = {};
  for (let newItem of newArray) {
    const key = makeSlotKey(newItem.type, newItem.position);
    if (obj[key]) {
      obj[key] = Object.assign(obj[key], newItem);
    } else if (
      newItem.hasOwnProperty('srcType') &&
      newItem.hasOwnProperty('srcPosition') &&
      newItem.hasOwnProperty('destType') &&
      newItem.hasOwnProperty('destPosition')
    ) {
      const {srcType, srcPosition, destType, destPosition, ...rest} = newItem;
      const destKey = makeSlotKey(destType, destPosition);
      const srcKey = makeSlotKey(srcType, srcPosition);
      newObj[destKey] = (
        Object.assign({}, obj[srcKey], getSlotProps(obj[destKey]), rest)
      );
      if (compareObjects(obj[destKey], getSlotProps(obj[destKey]))) {
        newObj[srcKey] = getSlotProps(obj[srcKey]);
      }
    } else {
      obj[key] = newItem;
    }
  }
  obj = Object.assign(obj, newObj);
  // convert object of items into array of items
  let result = [];
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop].hasOwnProperty('quantity') && obj[prop].quantity === 0) {
        result.push(getSlotProps(obj[prop]));
      } else {
        result.push(obj[prop]);
      }
    }
  }
  return result;
};

export function updateStory(state, action) {
  if (action.payload.story) {
    return state.stories.concat([
      Object.assign({}, action.payload.story, {
        inventoryChanges: action.payload.inventory || [],
        partyChanges: action.payload.party || [],
        buttons: action.payload.story.buttons || [ { text: 'OK', id: 1 } ],
        canDispatch: action.payload.story.buttons ? true : false,
        timestamp: Date.now()
      })
    ]);
  } else {
    return state.stories;
  }
}

// Helper function that enforces minimum offset between update text timestamps
function getTimestamp (changes, offset, now) {
  if (changes.length > 0) {
    const latest = changes[changes.length - 1];
    if (now - latest.timestamp < offset) {
      return latest.timestamp + offset;
    }
  }
  return now;
}

export function updateInventoryChanges(state, action) {
  const inventory = action.payload.inventory;
  if (inventory && inventory.length > 0) {
    const now = Date.now();
    const timestamp = getTimestamp(state.inventoryChanges, UPDATE_TEXT_OFFSET, now);
    return state.inventoryChanges.concat(
      inventory
      .filter(item => {
        return item.hasOwnProperty('change');
      })
      .map((item, index) => {
        return Object.assign({}, item, {
          timestamp: timestamp + index * UPDATE_TEXT_OFFSET
        })
      })
    );
  } else {
    return state.inventoryChanges;
  }
}

export function updatePartyChanges(state, action) {
  const party = action.payload.party;
  if (party && party.length > 0) {
    let changes = [];
    const now = Date.now();
    for (let item of party) {
      const memberChanges = state.partyChanges.filter(member => item.id === member.id);
      let timestamp = getTimestamp(memberChanges, UPDATE_TEXT_DURATION, now)

      // NOTE Check for health changes
      if (item.hasOwnProperty('health_change') && item.health_change !== 0) {
        changes.push(Object.assign({}, {
          id: item.id,
          change: item.health_change,
          name: 'health',
          timestamp: timestamp
        }));
        timestamp += UPDATE_TEXT_DURATION;
      }

      // Check for new or dead party members
      // NOTE loggedIn tests whether the user is starting a new session
      if (item.hasOwnProperty('health') && state.loggedIn === true) {
        const match = state.party.find(member => member.id === item.id)
        if (!match) {
          changes.push(Object.assign({}, {
            id: item.id,
            change: 1,
            name: item.name,
            timestamp: timestamp
          }));
          timestamp += UPDATE_TEXT_DURATION;
        } else if (item.health === 0) {
          changes.push(Object.assign({}, {
            id: item.id,
            change: -1,
            name: item.name,
            timestamp: timestamp
          }));
          timestamp += UPDATE_TEXT_DURATION;
          continue;
        }
      }

      // Check for jeito changes
      if (item.hasOwnProperty('jeito_change') && item.jeito_change !== 0) {
        changes.push(Object.assign({}, {
          id: item.id,
          change: item.jeito_change,
          name: 'jeito',
          timestamp: timestamp
        }));
        timestamp += UPDATE_TEXT_DURATION;
      }

      // Check for skill changes
      if (item.hasOwnProperty('skill_changes') && item.skill_changes.length > 0) {
        changes = changes.concat(
          item.skill_changes.map(change => {
            const result = Object.assign({}, {
              id: item.id,
              change: 1,
              name: change.name,
              timestamp: timestamp
            });
            timestamp += UPDATE_TEXT_DURATION;
            return result;
          })
        );
      }

      // Check for modifier changes
      if (item.hasOwnProperty('modifier_changes') && item.modifier_changes.length > 0) {
        changes = changes.concat(
          item.modifier_changes.map(change => {
            const match = item.modifiers.find(modifier => modifier.id === change.id)
            const result = Object.assign({}, {
              id: item.id,
              change: match ? 1 : -1,
              name: change.name,
              timestamp: timestamp
            });
            timestamp += UPDATE_TEXT_DURATION;
            return result;
          })
        );
      }
    }
    return state.partyChanges.concat(changes);
  } else {
    return state.partyChanges;
  }
}

export function getActions(inventory, tiles, position) {
  let actions = { 'main': [] };

  let itemsByTag = {};
  inventory.length > 0 && inventory.forEach(item => {
    item.tags && item.tags.forEach((tag, index) => {
      if (itemsByTag[tag]) {
        itemsByTag[tag].push(item);
      } else {
        itemsByTag[tag] = Array(item);
      }
    });
  });

  if (itemsByTag['seed']) {
    actions['main'].push({ target: 'seed', id: 10, tileset: 'icons' });
    actions['seed'] = [ { target: 'main', name: 'back', id: 18, tileset: 'icons' } ]
    .concat(
      itemsByTag['seed']
      .map(item => {
        return { tag: 'seed', name: `plant ${item.name}`, id: item.id, tileset: 'items' }
      })
    );
  }

  const currentTile = tiles.find(tile => tile.id === position);
  if (currentTile && currentTile.crops && currentTile.crops.length > 0) {
    actions['main'].push({ target: 'harvest', id: 14, tileset: 'icons' });
    actions['harvest'] = [ { target: 'main', name: 'back', id: 18, tileset: 'icons' } ]
    .concat(currentTile.crops.map(crop => {
      if (crop.stage === 0) {
        return Object.assign({}, crop, { tag: 'harvest', tileset: 'items' });
      } else {
        return Object.assign({}, crop, { id: 12, tileset: 'icons' });
      }
    }));
  }

  if (currentTile && currentTile.fishing && itemsByTag['fishing']) {
    actions['main'].push({ target: 'fishing', id: 17, tileset: 'icons' });
    actions['fishing'] = [ { target: 'main', name: 'back', id: 18, tileset: 'icons' } ]
    .concat(
      itemsByTag['fishing']
      .map(item => {
        return { tag: 'fishing', name: item.name, id: item.id, tileset: 'items' }
      })
    );
  }

  if (currentTile && currentTile.hunting && itemsByTag['hunting']) {
    actions['main'].push({ target: 'hunting', id: 16, tileset: 'icons' });
    actions['hunting'] = [ { target: 'main', name: 'back', id: 18, tileset: 'icons' } ]
    .concat(
      itemsByTag['hunting']
      .map(item => {
        return { tag: 'hunting', name: item.name, id: item.id, tileset: 'items' }
      })
    );
  }

  return actions;
}
