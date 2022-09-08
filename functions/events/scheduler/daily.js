// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const kv = require('../../../helpers/kv/functions.js');

// get current time
let now = new Date();

// get all kv entries
let entries = await kv.entries();
//console.log(entries)

// filter all kv entries that include uno-game
let unoEntries = entries.filter((entry) => entry.includes('uno-game'));

//console.log(unoEntries);

// if expiry time is before current time, delete entry
for (let i = 0; i < unoEntries.length; i++) {
  //console.log(unoEntries)
  if (unoEntries[i].expiry < now) {
    await kv.clear(unoEntries[i].key);
  }
}

