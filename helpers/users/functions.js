const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
module.exports = {
  retrieve: async (user_id) => {
    return await lib.discord.users['@0.2.1'].retrieve({
      user_id: user_id
    });
  },
}