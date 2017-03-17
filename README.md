# redux-persist-transform-expire

Add expiration to your persisted store.

## Usage

```js
import createExpirationTransform from 'redux-persist-transform-expire';

const expireTransform = createExpirationTransform({
  'reducer0' :{
      expireSpan: 1000 * 5, // 5s
      default: {} // default data when expired
  },
  'reducer1' :{
      expireSpan: 1000 * 2,
      default: null
  }
});

persistStore(store, {
  transforms: [expireTransform]
});

```
