const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  create: async (token) => {
    await lib.discord.interactions['@1.0.1'].followups.create({
      token: token,
    });
  },
  update: async (token, content, embeds = [], components = []) => {
    await lib.discord.interactions['@1.0.1'].followups.update({
      token: token,
      content: content,
      embeds: embeds,
      components: components,
    });
  },
  ephemeral: async (token, content, embeds = [], components = []) => {
    await lib.discord.interactions['@1.0.1'].followups.ephemeral.create({
      token: token,
      content: content,
      embeds: embeds,
      components: components,
    });
  },
}
