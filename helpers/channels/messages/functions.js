const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  create: async (channel, content, embeds = [], components = []) => {
    return await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: channel,
      content: content,
      components: components,
      embeds: embeds,
    });
  },
  update: async (channel, message, content, embeds = [], components = []) => {
    return await lib.discord.channels['@0.3.2'].messages.update({
      channel_id: channel,
      message_id: message,
      content: content,
      components: components,
      embeds: embeds,
    });
  },
  destroy: async (channel, message) => {
    return await lib.discord.channels['@0.3.2'].messages.destroy({
      channel_id: channel,
      message_id: message,
    });
  },
  retrieve: async (channel, message) => {
    return await lib.discord.channels['@0.3.2'].messages.retrieve({
      channel_id: channel,
      message_id: message,
    });
  }
}