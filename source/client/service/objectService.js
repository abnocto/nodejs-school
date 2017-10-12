import { stateFlags, objectFlags } from './flagService';

export function getInitialState() {
  return {
    byId: {},
    keys: [],
    ...stateFlags,
  };
}

/**
 * Reads entities from server list
 * @param { Object } state
 * @param { Array } list
 * @returns { Object }
 */
export function read(state, list) {
  const byId = {};
  
  list.forEach((entity) => {
    byId[entity.id] = {
      ...entity,
      ...objectFlags,
    };
  });
  
  const keys = Object.keys(byId).map(key => Number(key));
  
  return {
    ...state,
    byId,
    keys,
    ...stateFlags,
  };
}

/**
 * Adds new entity from server object
 * @param { Object } state
 * @param { Object } object
 * @returns { Object }
 */
export function create(state, object) {
  return {
    ...state,
    byId: {
      ...state.byId,
      [object.id]: {
        ...object,
        ...objectFlags,
      },
    },
    keys: [
      ...state.keys,
      object.id,
    ],
    ...stateFlags,
  };
}

/**
 * Replaces entity object with server object
 * @param { Object } state
 * @param { Object } object
 * @returns { Object }
 */
export function update(state, object) {
  return {
    ...state,
    byId: {
      ...state.byId,
      [object.id]: {
        ...object,
        ...objectFlags,
      },
    },
    ...stateFlags,
  };
}

/**
 * Returns deep copy of object (copies object entities, all object entities' values should be primitives)
 * @param { Object } object
 * @returns { Object }
 */
export function copy(object) {
  return Object.keys(object).reduce((_obj, id) => {
    _obj[id] = { ...object[id] };
    return _obj;
  }, {});
}

/**
 * Deletes entity object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function remove(state, objectId) {
  const byId = copy(state.byId);
  delete byId[objectId];
  return {
    ...state,
    byId,
    keys: state.keys.filter(id => id !== objectId),
    ...stateFlags,
  };
}
