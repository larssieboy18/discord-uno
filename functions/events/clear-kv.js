const kv = require('../../helpers/kv/functions.js');

// clear kv for specified guild and channel
let guild = '975789410186567730'
let channel = '1017822489566531725'

await kv.clear(`unoGame-${guild}_${channel}`)