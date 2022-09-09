const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  update: async (channel_id, overwrite_id, role = true, allow, deny) => {
    let type = 0
    if (!role) { type = 1 }
    return await lib.discord.channels['@0.3.2'].permissions.update({
      overwrite_id: overwrite_id,
      channel_id: channel_id,
      allow: allow,
      deny: deny,
      type: type
    })
  },
  destroy: async (channel_id, overwrite_id) => {
    return await lib.discord.channels['@0.3.2'].permissions.destroy({
      overwrite_id: overwrite_id,
      channel_id: channel_id
    });
  }
}
