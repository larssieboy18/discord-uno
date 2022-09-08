const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  retrieve: async (channel_id) => {
    return await lib.discord.channels['@0.3.2'].retrieve({
      channel_id: channel_id
    });
  }, destroy: async (channel_id) => {
    return await lib.discord.channels['@0.3.2'].destroy({
      channel_id: channel_id
    });
  },
  update: async (channel_id, name = '', type = 0, position = 0, topic = '', nsfw = false, slowmode = 0, bitrate = 64000, userlimitVC = 0, permissions = {}, parent_id = 0) => {
    return await lib.discord.channels['@0.3.2'].update({
      channel_id: channel_id,
      name: name,
      type: type,
      position: position,
      topic: topic,
      nsfw: nsfw,
      rate_limit_per_user: slowmode,
      bitrate: bitrate,
      user_limit: userlimitVC,
      permission_overwrites: permissions,
      parent_id: `${parent_id}`
    });
  }
}