import { copy } from './reducersObjectService';

export const stateFlags = {
  isPending: false,
  isError: false,
  isCreatePending: false,
  isCreateForbidden: false,
  isCreateError: false,
};

export const objectFlags = {
  isPending: false,
  isUpdateForbidden: false,
  isDeleteForbidden: false,
  isError: false,
};

/**
 * Fires state isPending flag
 * @param { Object } state
 * @returns { Object }
 */
export function setPending(state) {
  return {
    ...state,
    ...stateFlags,
    isPending: true,
  };
}

/**
 * Fires state isError flag
 * @param { Object } state
 * @returns { Object }
 */
export function setError(state) {
  return {
    ...state,
    ...stateFlags,
    isError: true,
  };
}

/**
 * Fires state isCreatePending flag
 * @param { Object } state
 * @returns { Object }
 */
export function setCreatePending(state) {
  return {
    ...state,
    ...stateFlags,
    isCreatePending: true,
  };
}

/**
 * Fires state isCreateForbidden flag
 * @param { Object } state
 * @returns { Object }
 */
export function setCreateForbidden(state) {
  return {
    ...state,
    ...stateFlags,
    isCreateForbidden: true,
  };
}

/**
 * Fires state isCreateError flag
 * @param { Object } state
 * @returns { Object }
 */
export function setCreateError(state) {
  return {
    ...state,
    ...stateFlags,
    isCreateError: true,
  };
}

/**
 * Reset state flags
 * @param { Object } state
 * @param { RegExp } mask
 * @returns { Object }
 */
export function resetStateFlags(state, mask) {
  const _state = copy(state);
  Object.keys(_state).forEach((key) => {
    if (mask.test(key)) {
      _state[key] = false;
    }
  });
  return _state;
}

/**
 * Fires isPending flag for object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function setObjectPending(state, objectId) {
  return {
    ...state,
    ...stateFlags,
    byId: {
      ...state.byId,
      [objectId]: {
        ...state.byId[objectId],
        ...objectFlags,
        isPending: true,
      },
    },
  };
}

/**
 * Fires isUpdateForbidden flag for object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function setObjectUpdateForbidden(state, objectId) {
  return {
    ...state,
    ...stateFlags,
    byId: {
      ...state.byId,
      [objectId]: {
        ...state.byId[objectId],
        ...objectFlags,
        isUpdateForbidden: true,
      },
    },
  };
}

/**
 * Fires isDeleteForbidden flag for object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function setObjectDeleteForbidden(state, objectId) {
  return {
    ...state,
    ...stateFlags,
    byId: {
      ...state.byId,
      [objectId]: {
        ...state.byId[objectId],
        ...objectFlags,
        isDeleteForbidden: true,
      },
    },
  };
}

/**
 * Fires isError flag for object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function setObjectError(state, objectId) {
  return {
    ...state,
    ...stateFlags,
    byId: {
      ...state.byId,
      [objectId]: {
        ...state.byId[objectId],
        ...objectFlags,
        isError: true,
      },
    },
  };
}

/**
 * Set special flags to false for object with objectId
 * @param { Object } state
 * @param { Number } objectId
 * @returns { Object }
 */
export function setObjectFlagsFalse(state, objectId) {
  return {
    ...state,
    ...stateFlags,
    byId: {
      ...state.byId,
      [objectId]: {
        ...state.byId[objectId],
        ...objectFlags,
      },
    },
  };
}
