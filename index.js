'use strict'

import reduxPersist from 'redux-persist';

import traverse from 'traverse';

const PERSIST_EXPIRE_DEFAULT_KEY = 'persistExpiresAt';

function hasExpired(expireDate) {
  return dateToUnix(expireDate) < dateToUnix(new Date());
}

function dateToUnix(date) {
  return +(date.getTime() / 1000).toFixed(0);
}

export default function createExpirationTransform(config) {
  config = config || {};
  config.expireKey = config.expireKey || PERSIST_EXPIRE_DEFAULT_KEY;
  config.defaultState = config.defaultState || {};
  const inbound = state => state;
  const outbound = state => {
    if (!state) {
      return state;
    }
    const validState = traverse(state).map(function (reducerState) {
      if (!reducerState || typeof reducerState !== 'object') {
        return;
      }
      const reducerExpireAt = reducerState.hasOwnProperty(config.expireKey) ? reducerState[config.expireKey] ? reducerState[config.expireKey] : null : null;
      if (!reducerExpireAt) {
        return;
      }
      if (hasExpired(reducerExpireAt)) {
        // assign each reducer default state when expired  
        if (reducerState.expireDatas) {
          for (let key in reducerState.expireDatas) {
            const data = reducerState.expireDatas[key];
            if (reducerState.hasOwnProperty(key)) {
              reducerState[key] = data;
            }
          }
        }
        else {
          reducerState = config.defaultState;
        }
      }
    });
    return validState;
  };
  return reduxPersist.createTransform(inbound, outbound);
}