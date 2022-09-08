const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  create: async (token, response_type = 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE') => {
    await lib.discord.interactions['@1.0.1'].responses.create({
      token: token,
      response_type: `${response_type}`,
    });
  },
  update: async (token, content, embeds = [], components = [], response_type = 'CHANNEL_MESSAGE_WITH_SOURCE') => {
    return await lib.discord.interactions['@1.0.1'].responses.update({
      token: token,
      content: content,
      embeds: embeds,
      components: components,
      response_type: `${response_type}`,
    });
  },
  retrieve: async (token) => {
    return await lib.discord.interactions['@1.0.1'].responses.retrieve({
      token: token
    });
  },
  destroy: async (token) => {
    return await lib.discord.interactions['@1.0.1'].responses.destroy({
      token: token
    });
  }
}