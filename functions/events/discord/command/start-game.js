// authenticates you with the API standard library
const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN }); // need to get rid of all lib references and use the helper files instead
const responses = require('../../../../helpers/interactions/responses.js');
const kv = require('../../../../helpers/kv/functions.js');
const guilds = require('../../../../helpers/guilds/functions.js');
const functions = require('../../../../helpers/others/functions.js');
const messages = require ('../../../../helpers/channels/messages/functions.js');
const users = require ('../../../../helpers/users/functions.js');

// ACK the event
await responses.create(context.params.event.token);

if (!context.params.event.guild_id) {
  return await responses.update(context.params.event.token, `This command can only be used in a server.`);
}

let { event } = context.params,
  { member, data, token, guild_id, received_at } = event;

/* Getting the channel from the options. */
let channel = (data.options.find((option) => option.name == `channel`)).value;

// TODO check if selected channel is a text channel
// sometimes people can select a voice channel or category, either on purpose or by accident. This should cause the command to fail.
// lines: 16, 20
// assignees: larssieboy18
// labels: enhancement

// // check if there already is a game in progress inside the same channel
// let gameInProgress = await kv.get(`unoGame-${guild_id}-${channel}`, false);
// if (gameInProgress) {
//   return await responses.update(token, `There already is a game in progress in <#${channel}>. Only one game can be played in a channel at a time.`);
// }

let startMessage = await responses.retrieve(token);

let sleep = functions.sleep;

/* create a list with players - person running the command is player1 and is automatically added to the list */
let playerlist = [`${member.user.id}`]

/* Checking if there are more than 8 players. If there are, it will return a message saying that you
can only play UNO with up to 8 players. If there are not, it will continue the rest of the file. 
Cannot be bigger than 9, as the options also include the channel that the game starts in. */
if (data.options.length > 9) {
  console.error(`There shouldn't be more than 8 players`);
  return await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    content: `You can only play UNO with up to 8 players.`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
}

// create playerlist
for (let i = 2; i <= 8; i++) {
  let playerID =
    data.options.find((option) => option.name == `player${i}`) || null;
  if (playerID) {
    /* Checking if the playerlist includes the playerID.value. If it does, it will return a message
    saying that you can't have two of the same player. If it doesn't, it will continue the rest of
    the file. */
    if (playerlist.includes(playerID.value)) {
      return await lib.discord.interactions['@1.0.1'].responses.update({
        token: `${token}`,
        content: `You can't add two of the same player. Game cancelled.`,
        response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
      });
    }
    playerlist.push(playerID.value);
  }
}

/* Checking if there are any bots in the playerlist. If there are, it will return a message saying that
you can't add a bot to the playerlist and cancel the game. */
let botInPlayerlist = false;
for (let i = 0; i < playerlist.length; i++) {
  let user = await users.retrieve(playerlist[i]);
  if (user.bot) {
    botInPlayerlist = true;
    break;
  }
}
if (botInPlayerlist) {
  return await responses.update({
    token: `${token}`,
    content: `You can't add a bot to the playerlist. Game cancelled`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
}

// prepare for start message
let player, embed, guildinfo = await guilds.retrieve(guild_id), fields = [{
  name: `✅ Player 1`,
  value: `<@${member.user.id}>`,
  inline: false,
}];

// send a DM to every player on the playerlist
for (let i = 1; i < playerlist.length; i++) {
  try {
    // get information about the member
    player = await lib.discord.guilds['@0.2.4'].members.retrieve({
      guild_id: `${guild_id}`,
      user_id: `${playerlist[i]}`,
    });
    // create DM channel
    let DMchannel = await lib.discord.users['@0.2.1'].me.channels.create({
      recipient_id: playerlist[i],
    });
    // send a message to the DMchannel with accept and deny buttons
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: DMchannel.id,
      content: ``,
      components: [
        {
          type: 1,
          components: [
            {
              style: 3,
              label: `Accept`,
              custom_id: `accept-uno-invite`,
              disabled: false,
              emoji: {
                id: `984488658658807818`,
                name: `acheck`,
                animated: true,
              },
              type: 2,
            },
            {
              style: 4,
              label: `Deny`,
              custom_id: `deny-uno-invite`,
              disabled: false,
              emoji: {
                id: `984488679173140520`,
                name: `across`,
                animated: true,
              },
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          title: 'UNO',
          description: `Hello <@${player.user.id}>! You have been invited to play UNO.\nDo you accept?`,
          color: 0x2f3136,
          fields: [
            {
              name: `Invited by`,
              value: `<@${member.user.id}>`,
              inline: true,
            },
            {
              name: `Invited at`,
              value: `<t:${Math.floor(new Date(received_at).getTime() / 1000)}:f>`,
              inline: true,
            },
            {
              name: `Server`,
              value: `**${guildinfo.name}** (*ID*: \`${guild_id}\`)`,
              inline: true,
            },
            {
              name: `Invite message`,
              value: `[Click here](https://discordapp.com/channels/${guild_id}/${startMessage.channel_id}/${startMessage.id})`,
              inline: true,
            },
            {
              name: `Accepted by you?`,
              value: `❌`,
              inline: true,
            }
          ],
        }]
    });

    // make field for every player in playerlist
    for (let i = 1; i < playerlist.length; i++) {
      fields.push({
        name: `❌ Player ${i + 1}`,
        value: `<@${player.user.id}>`,
        inline: false,
      });
    }

    await sleep(1000);

    /* Catching an error and returning a message saying that there was an error sending the DM to the
    player. */
  } catch (errSendingDM) {
    console.error(errSendingDM);
    return await lib.discord.interactions['@1.0.1'].responses.update({
      token: `${token}`,
      content: `There was an error sending the DM to player <@${player.id}>.`,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    });
  }
}

// get current time
let time = new Date(received_at);

//expiry time in 30 minutes in seconds
let expiry = 30 * 60;

/* Setting the time to 10 minutes from now. */
time.setMinutes(time.getMinutes() + 10);

// the embed should include a message saying that if not everyone accepts within 10 minutes, the game will be cancelled
// and the players will be notified

/* Creating an embed with the title 'UNO playerlist', the description 'The following players have been
invited to your game:', the color 0x2f3136 and the fields 'fields'. 
*/

embed = [
  {
    title: 'UNO playerlist',
    description: `All players have received an invite for a game of UNO in <#${channel}>! If not everyone accepts <t:${Math.floor(time / 1000)}:R>, the game will be cancelled. \nWhen a player accepts, they will be added to the game and a checkmark will appear in the list below. \nIf not everyone accepts, the game will start with the players that accepted.`,
    color: 0x2f3136,
    fields: fields,
  }
];

// TODO cancel button for the game creator
// assignees: larssieboy18
// lines: 204, 205
// labels: enhancement
// Add a button to the embed that allows the user to cancel the game.

/* Sending a message to the channel where the command was used. */
await responses.update(token, '', embed, [], 'CHANNEL_MESSAGE_WITH_SOURCE');

// TODO remove the double message
// labels: bug
// assignees: larssieboy18
// lines: 214
// Decide where the message should be sent and remove the other message.
/* Sending a message to the channel where the game will be played. */

await messages.create(channel, '', embed, []);

startMessage = await responses.retrieve(token);

// console.log(startMessage)
// console.log(channel)

console.log(time);

/* Creating an array called allPlayers and pushing the id of the member who used the command,
setting accepted to true and creator to true. Then it is looping through the playerlist and pushing
the
id of the players in the playerlist, setting accepted to false and creator to false. */
let allPlayers = [];
allPlayers.push({ id: member.user.id, accepted: true, denied: false, creator: true });
for (let i = 1; i < playerlist.length; i++) {
  allPlayers.push({ id: playerlist[i], accepted: false, denied: false, creator: false });
}

/* Setting the key to unoGame-guild_id-channel, the value to startMessage, startDate, expiryDate and
players and the expiry to expiry. */
await kv.set(`unoGame-${guild_id}-${channel}`, {
  startMessage: startMessage,
  startDate: `${new Date(received_at)}`,
  expiryDate: `${time}`,
  players: allPlayers,
  gameChannel: channel,
}, expiry);
let kvpair = await kv.get(`unoGame-${guild_id}-${channel}`);

console.log(kvpair);