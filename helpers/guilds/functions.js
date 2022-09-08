const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  retrieve: async (guild_id) => {
    return await lib.discord.guilds['@0.2.4'].retrieve({
      guild_id: guild_id
    });
  },
}
