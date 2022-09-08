const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  get: async (key, defaultValue = '') => {
    return await lib.keyvalue.store['@0.1.16'].get({
      key: key,
      defaultValue: defaultValue,
    });
  },
  set: async (key, value, ttl = 0) => {
    return await lib.keyvalue.store['@0.1.16'].set({
      key: key,
      value: value,
      ttl: ttl,
    });
  },
  clear: async (key) => {
    return await lib.keyvalue.store['@0.1.16'].clear({
      key: key,
    });
  },
  entries: async () => {
    return await lib.keyvalue.store['@0.1.16'].entries();
  }
}