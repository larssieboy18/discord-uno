const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  create: async (channel, name, archive = 1440, type = 'GUILD_PUBLIC_THREAD') => {
    return await lib.discord.channels['@0.3.2'].threads.create({
      channel_id: channel,
      name: name,
      auto_archive_duration: archive,
      type: type,
    });
  },
  update: async (thread_id, name = '', archive = 1440, locked = true, slowmode = 0, archived = false) => {
    return await lib.discord.channels['@0.3.2'].threads.update({
      thread_id: thread_id,
      name: name,
      auto_archive_duration: archive,
      locked: locked,
      rate_limit_per_user: slowmode,
      archived: archived,
    });
  },
  join: async (thread) => {
    return await lib.discord.channels['@0.3.2'].threads.join({
      thread_id: thread,
    });
  },
  list: async (channel, active = true, private = false, before = '', limit = 0) => {
    return await lib.discord.channels['@0.3.2'].threads.list({
      channel_id: channel,
      active: active,
      private: private,
      before: before,
      limit: limit,
    });
  },
  leave: async (thread) => {
    return await lib.discord.channels['@0.3.2'].threads.leave({
      thread_id: thread,
    });
  }
}
