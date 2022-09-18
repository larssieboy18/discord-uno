const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
const responses = require('../../../../../helpers/interactions/responses.js');
const messages = require('../../../../../helpers/channels/messages/functions.js');
const kv = require('../../../../../helpers/kv/functions.js');
const http = require('../../../../../helpers/http/functions.js');

let { user, token, message, channel_id } = context.params.event

// ACK the event
await responses.create(token, 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE');

/* It's getting the IDs of the guild, channel, and message from the messagelink. */
let playerlistGuildID, playerlistChannelID, playerlistMessageID

try {
  /* It's getting the IDs of the guild, channel, and message from the messagelink. */
  let IDs = message.embeds[0].fields[3].value.match(/\/\d+/gi)
  playerlistGuildID = IDs[0].match(/\d+/gi)[0]
  playerlistChannelID = IDs[1].match(/\d+/gi)[0]
  playerlistMessageID = IDs[2].match(/\d+/gi)[0]
}
/* It's catching an error that occurs when the message has been deleted. */
catch (errorGettingDetails) {
  console.error(errorGettingDetails)
  return await responses.update(token, 'There was an error getting the details of the game.')
}

let guild_id = playerlistGuildID

// if the game was already accepted, return
if (message.embeds[0].fields[4].value == '✅') {
  return await responses.update(token, 'The game was already accepted.')
}

let PLmessage = await messages.retrieve(playerlistChannelID, playerlistMessageID), fields = PLmessage.embeds[0].fields

// find the game channel from the PLmessage
let gameChannel = PLmessage.embeds[0].description.match(/<#\d+>/gi)[0].match(/\d+/gi)[0]

/* It's checking to see if the user has been invited to a game. If they have, it will replace the ❌
with a ✅. If they haven't, it will send a message saying that they haven't been invited to a game. */
let matchCount = 0
for (let i = 0; i < fields.length; i++) {
  if (fields[i].value.includes(user.id) && fields[i].name.includes('❌')) {
    fields[i].name = fields[i].name.replace(`❌`, `✅`)
    matchCount++
    break
  }
}
if (matchCount < 1) {
  return await responses.update(token, `Unable to find a pending game that you were invited to. The button will only work if you have been recently invited and have not accepted yet.`)
}

/* It's creating a new embed object with the same title, description, color, and fields as the original embed. */
let newEmbeds = [{
  title: PLmessage.embeds[0].title,
  description: PLmessage.embeds[0].description,
  color: PLmessage.embeds[0].color,
  fields: fields,
}]

/* It's trying to update the message, and if it fails, it's creating a new message in the channel. */
try {
  await messages.update(playerlistChannelID, playerlistMessageID, PLmessage.content, newEmbeds)
}
catch (errorUpdatingMessage) {
  console.error(errorUpdatingMessage)
  return await messages.create(playerlistChannelID, `An error occured while updating the message. This was most likely causes by the message being deleted.`)
}

let fieldsv2 = message.embeds[0].fields
for (let j = 0; j < fieldsv2.length; j++) {
  if (fieldsv2[j].name.match(/accepted/i)) {
    fieldsv2[j].value = `✅`
  }
}

let newDMEmbeds = [{
  title: message.embeds[0].title,
  description: message.embeds[0].description,
  color: message.embeds[0].color,
  fields: fieldsv2,
  components: [
    {
      "type": 1,
      "components": [
        {
          "style": 3,
          "label": `The game was succesfully accepted`,
          "custom_id": `thisbuttoncannotbeclicked`,
          "disabled": true,
          "emoji": {
            "id": null,
            "name": `✔`
          },
          "type": 2
        }
      ]
    }
  ]
}]

try {
  await messages.update(channel_id, message.id, message.content, newDMEmbeds)
} catch (errorUpdatingMessage2) {
  return console.error(errorUpdatingMessage2)
}

PLmessage = await messages.retrieve(playerlistChannelID, playerlistMessageID)
fields = PLmessage.embeds[0].fields

/* It's checking to see if all of the players have accepted the game. If they have, it will send a
message to the user who accepted the game saying that the game will start shortly. If they haven't,
it will send a message to the user who accepted the game saying that they will be notified when the
game starts. */

// TODO allAccepted initial message
// labels: enhancement
// assignees: larssieboy18
// lines: 123,132
// if everyone has accepted the game, the initial message should be edited to something like: "everyone has accepted the game. It has started in <#channel>"

let allAccepted
for (let i = 0; i < fields.length; i++) {
  if (fields[i].name.includes('❌')) {
    allAccepted = false;
    return await responses.update(token, `You have succesfully accepted the game invite! You will be notified when the game starts.`)
  }
}
allAccepted = true;

await responses.update(token, `You have succesfully accepted the game invite! As you were the last person to accept the game invite, the game will start shortly.`)

// start the game
let game = await kv.get(`unoGame-${guild_id}-${gameChannel}`);
if (!game) {
  return console.error(`There was an error getting the game data.` + `\n` + `Guild ID: ${guild_id}` + `\n` + `Channel ID: ${gameChannel}` + `\n` + `Message ID: ${playerlistMessageID}`)
} 

let startGame = await http.post(`https://${context.service.environment}--${context.service.path[1]}.${context.service.path[0]}.autocode.gg/events/discord/uno/start/`, '', {auth: context.service.hash}, {event: context.params.event, game: game, allAccepted: allAccepted,})
console.log(startGame)

// if startGame is true, an error occured while starting the game. If it's false, the game started successfully.
if (startGame) {
  console.log(startGame)
  return await messages.create(context.params.event.channel_id, `There was an error starting the game. If this keeps happening, please report this on our Github page https://github.com/larssieboy18/discord-uno/issues and include the following error message: \`${startGame.toString()}\``)
}
