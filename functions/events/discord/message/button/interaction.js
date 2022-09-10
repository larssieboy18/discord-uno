const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
const responses = require('../../../../../helpers/interactions/responses.js');
const messages = require('../../../../../helpers/channels/messages/functions.js');
const kv = require('../../../../../helpers/kv/functions.js');
const uno_deck = require('../../../../../helpers/others/uno_deck.json');
const { unoCards } = require('../../../../../helpers/others/uno_cards.json');
const { shuffle, gameStartFromDM } = require('../../../../../helpers/others/functions.js');
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

console.log(`https://${context.service.environment}--${context.service.path[1]}.${context.service.path[0]}.autocode.gg/events/discord/uno/start`)
let startGame = await http.post(`https://${context.service.environment}--${context.service.path[1]}.${context.service.path[0]}.autocode.gg/events/discord/uno/start/`, '', {auth: context.service.hash}, {event: context.params.event, game: game, allAccepted: allAccepted,})
console.log(startGame)

// startGame will be either true or false, depending on whether or not the game started successfully. If it didn't, it will send a message to the game channel saying that the game failed to start.
if (startGame == false) {
  return await messages.create(gameChannel, `The game failed to start. Please try again.`)
}


 /*
 All code after here should be gone (?) because it will be moved to the new file.
 */ 
// let players = game.players, playerIDs = Object.keys(players), playerCount = playerIDs.length

// // shuffle the deck
// let deck = shuffle(uno_deck)

// // deal the cards
// let hands = {}
// for (let i = 0; i < playerCount; i++) {
//   hands[playerIDs[i]] = []
//   for (let j = 0; j < 7; j++) {
//     hands[playerIDs[i]].push(deck.pop())
//   }
// }

// // get the first card
// let firstCard = deck.pop()

// // get the first player
// let firstPlayer = playerIDs[Math.floor(Math.random() * playerCount)]

// // set the game data
// game = {
//   players: players,
//   playerIDs: playerIDs,
//   playerCount: playerCount,
//   deck: deck,
//   hands: hands,
//   firstCard: firstCard,
//   firstPlayer: firstPlayer,
//   currentPlayer: firstPlayer,
//   direction: 1,
//   lastCard: firstCard,
//   lastPlayer: firstPlayer,
//   lastAction: 'draw',
//   lastActionPlayer: firstPlayer,
//   lastActionCount: 0,
//   lastActionCard: null,
//   lastActionCards: [],
//   lastActionColor: null,
//   lastActionWild: false,
//   lastActionDraw: false,
//   lastActionSkip: false,
//   lastActionReverse: false,
//   lastActionPlusAnyNumber: false,
//   lastActionPlusTwo: false,
//   lastActionPlusFour: false,
// }









// //await messages.create('976400262677803018', `${deck}`)

// await gameStartFromDM(context.params.event, playerlistGuildID, playerlistChannelID, playerlistMessageID, allAccepted, PLmessage)



// let cardData = [];
// let cardDisplay = '';
// for (let j = 0; j < 20; j++) {
//   cardData.push(unoCards.find((card) => card.name == deck[j]));
//   cardDisplay =
//     cardDisplay +
//     unoCards.find((card) => card.name == deck[j]).emoji;
// }

// await messages.create('976400262677803018', `${cardDisplay}`)
