/* This is importing the responses.js file from the helpers/interactions folder. */
const responses = require('../../../../helpers/interactions/responses.js');
console.log(context)

// ACK the event
await responses.create(context.params.event.token);

/* Creating an embed object that will be sent to the user. */
let infoEmbed = {
  title: `UNO Bot`,
  description: `This bot was created by Lars.#0018 (<@119473151913623552>). If you have any questions, suggestions or found any bugs, please contact me on Discord.`,
  color: 0x00ff00,
  fields: [
    {
      name: `Contributors`,
      value: `[Click to view](https://github.com/larssieboy18/discord-uno/graphs/contributors)`,
      inline: false,
    },
    {
      name: `UNO Cards`,
      value: `All cards have been downloaded from [Wikipedia](https://en.wikipedia.org/wiki/Uno_(card_game)#/media/File:UNO_cards_deck.svg), which were provided under the [CC0 license](http://creativecommons.org/publicdomain/zero/1.0/deed.en). Any edits have been made by a contributor to the project.`,
      inline: true,
    },
    {
      name: `License`,
      value: `This bot is Open Source under the [MPL-2.0 license](https://github.com/larssieboy18/discord-uno/blob/main/LICENSE). You can read more about the license [here](https://choosealicense.com/licenses/mpl-2.0/).`,
      inline: true,
    },
    {
      name: `Source Code`,
      value: `View on [GitHub](https://github.com/larssieboy18/discord-uno)`,
      inline: true,
    },
    {
      name: `Invite`,
      value: `Invite the bot to your server [here](https://discord.com/api/oauth2/authorize?client_id=${process.env.botID}&permissions=532844899408&scope=applications.commands%20bot).`,
      inline: true,
    },
    {
      name: `Donate`,
      value: `If you want to support the development of the UNO bot, you can donate [here](https://opencollective.com/uno-discord-bot).`,
      inline: true,
    },
    {
      name: `Copyright notice`,
      value: `© 2022 [larssieboy18](https://github.com/larssieboy18) & [Contributors](https://github.com/larssieboy18/discord-uno/graphs/contributors)`,
      inline: false,
    },
  ],
};

/* This is sending the embed object to the user. */
await responses.update(
  `${context.params.event.token}`,
  '',
  [infoEmbed],
  [],
  'CHANNEL_MESSAGE_WITH_SOURCE',
);
