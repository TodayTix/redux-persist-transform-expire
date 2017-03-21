'use strict'

import reduxPersist from 'redux-persist';

const PERSIST_EXPIRE_DEFAULT_KEY = 'persistExpiresAt';

function dateToUnix(date) {
  return +(date.getTime() / 1000).toFixed(0);
}

function createExpirationTransform(expireDatas) {
  expireDatas = expireDatas || {};
  let stateMap = new Map();
  const inbound = (state, key) => {
    if ((state || typeof state === 'object') && expireDatas.hasOwnProperty(key)) {
      if (stateMap.has(key)) {
        if (typeof state.toJS === 'function') {
          let newState = state.toJS();
          newState.expireDate = new Date((new Date()).getTime() + expireDatas[key].expireSpan);
          return newState;
        }
        else {
          state.expireDate = new Date((new Date()).getTime() + expireDatas[key].expireSpan);
        }
      }
      else {
        stateMap.set(key, true);
      }
    }
    return state;
  };
  const outbound = (state, key) => {
    if ((state || typeof state === 'object') && expireDatas.hasOwnProperty(key)) {
      if (state.expireDate) {
        const data = expireDatas[key];
        if (dateToUnix(new Date(state.expireDate)) < dateToUnix(new Date())) {
          state = data.default;
        }
      }
    }
    return state;
  };
  return createTransform(inbound, outbound);
}