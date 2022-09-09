const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });
const { unoCards } = require('../others/uno_cards.json');
const uno_deck = require('../others/uno_deck.json');
const kv = require('../kv/functions.js');

module.exports = {
  /* Shuffles an array */
  shuffle: async (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  /* A function that takes in a card name and returns the card details of that card. */
  getCardByName: async (Card) => {
    let cardDetails = unoCards.find((card) => card.name == Card);
    return cardDetails;
  },
  /* Returning the card details of the card with the given color and value. */
  getCardByColorValue: async (color, value) => {
    let cardDetails = unoCards.find((card) => card.color == color && card.value == value);
    return cardDetails;
  },
  /* This function takes in an emoji and returns the card details of the card with that emoji. */
  getCardByEmoji: async (emoji) => {
    let cardDetails = unoCards.find((card) => card.emoji == emoji);
    return cardDetails;
  },
  checkIfCardIsValid: async (playedCard, topCard) => {
    let playedCardDetails = await module.exports.getCardByName(playedCard);
    let topCardDetails = await module.exports.getCardByName(topCard);
    if (playedCardDetails.color == 'wildcard' || playedCardDetails.color == topCardDetails.colour || playedCardDetails.value == topCardDetails.value) {
      return true;
    } else {
      return false;
    }
  },
  /* A function that waits for 1 second before continuing. */
  sleep: async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  gameStartFromDM: async (event, guild_id, channel_id, message_id, allAccepted, PLmessage) => {
    let gameDeck = await shuffle(uno_deck);
    let kvdata = await kv.get(`unoGame-${guild_id}-${channel_id}`)
    let players = kvdata.players
    let playerList = []
    for (let i = 0; i < players.length; i++) {
      playerList.push(players[i].id)
    }
    let playerListMessage = await lib.discord.interactions['@1.0.1'].responses.create({
      token: `${PLmessage.token}`,
      content: `${playerList.join(', ')}`,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    });
    let playerListMessageID = playerListMessage.id;
    let gameData = {
      deck: gameDeck,
      discard: [],
      topCard: gameDeck[0],
      currentPlayer: playerList[0],
      playerList: playerList,
      playerListMessageID: playerListMessageID,
      allAccepted: allAccepted,
      gameStarted: true,
      gameEnded: false,
      gameStartedAt: new Date(),
      gameEndedAt: null,
      gameStartedBy: message.author.id,
      gameEndedBy: null,
      gameStartedByMessageID: message.id,
      gameEndedByMessageID: null,
      gameStartedByMessage: message,
      gameEndedByMessage: null,
      gameStartedByChannelID: message.channel.id,
      gameEndedByChannelID: null,
      gameStartedByChannel: message.channel,
      gameEndedByChannel: null,
      gameStartedByGuildID: message.guild.id,
      gameEndedByGuildID: null,
      gameStartedByGuild: message.guild,
      gameEndedByGuild: null,
    };
    await kv.set(`unoGame-${guild}-${channel}`, gameData);
    return gameData;

    // code here

  },
  // updateGameData: async (guild, channel, message, changes) => {
  //   let currentKvData = await kv.get(`unoGame-${guild}-${channel}`)
  //   let newKvData = Object.assign(currentKvData, changes)
  //   await kv.set(`unoGame-${guild}-${channel}`, newKvData)
  //   return newKvData
  // },
  allAccepted: async (some, variables, need, to, be, added, here) => {
    // code here
  },
};
