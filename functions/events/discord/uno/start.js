try {
const uno_deck = require('../../../../helpers/others/uno_deck.json');
const { unoCards } = require('../../../../helpers/others/uno_cards.json');
const { shuffle } = require('../../../../helpers/others/functions.js');
const kv = require('../../../../helpers/kv/functions.js');
const messages = require('../../../../helpers/channels/messages/functions.js');

// debugging
console.log(context)

// get channel id from context (this is the channel where the game is being played)
let {gameChannel} = context.params.game

// get guild id
let {guild_id} = context.params.event

// get playerlist from context (array of player objects)
let playerlist = context.params.game.players

// create starting deck
let startingDeck = await shuffle(uno_deck);

// create draw pile
let drawPile = [];

// create player hands
let playerHands = [];

// deal 7 cards to each player
// let  playerHands = playerlist.map(player => {
//   let hand = [];
//   for (let i = 0; i < 7; i++) {
//     hand.push(startingDeck.pop());
//   }
//   return {
//     id: player.id,
//     hand: hand
//   }
// })
for (let i = 0; i < playerlist.length; i++) {
  let player = playerlist[i];
  playerHands[player] = [];
  playerHands[player].unshift(startingDeck.slice(0, 7));
}

// create current deck
let currentDeck = startingDeck;

// create discard pile
let discardPile = [currentDeck.pop()];

// pick a random player from playerlist that starts the game
let startingPlayer = playerlist[Math.floor(Math.random() * playerlist.length)];

// add first card to discard pile
discardPile.push(startingDeck.pop());

// create game object
let game = {
  channel: gameChannel, // channel where the game is being played
  playerlist: playerlist, // array of player objects
  playerHands: playerHands, // object with player ids as keys and arrays of cards as values
  drawPile: drawPile, // draw pile is empty at the start of the game
  discardPile: discardPile, // discard pile has one card at the start of the game
  currentPlayer: startingPlayer, // player object of the player that starts the game
  direction: 1, // reverse
  drawTwo: 0, // +2
  skip: 0, // skip
  wildColor: null, // color change because of wildcard
  colorChangeBy: null, // player who changed the color
  wildDrawFour: 0, // +4
  playersWithUno: [], // array of player ids that have uno
  unoCalled: [], // array of player ids that called uno
  unoMissedCalled: false, // did someone notice that a player missed calling uno?
  unoMissedCalledBy: null, // player who noticed that someone missed calling uno
};

// debugging
console.log(game);
console.log(game.playerHands);

// save game to kv
await kv.set(`gameDetails-UNO-${guild_id}-${gameChannel}`, game, 604800 /* a week */);

// send starting message to game channel
let startingMessage = await messages.create(gameChannel, '',[{
  embed: {
    title: "UNO",
    description: `**${startingPlayer.name}** starts the game!`,
    color: 0x00ff00,
    fields: [
      {
        name: "Current Card",
        value: `${discardPile[0]}`,
        inline: true,
      },
      {
        name: "Current Player",
        value: `${startingPlayer.name}`,
        inline: true,
      },
    ],
  },
}], [
  // button to draw a card
  {
    style: 1,
    label: "Draw a card",
    custom_id: `uno-draw`,
    type: 2,
    disabled: false,
    emoji: {
      id: "null",
      name: "🃏",
    },
  },
  // button to view your own hand
{
    style: 1,
    label: "View your hand",
    custom_id: `view-hand`,
    type: 2,
    disabled: false,
    emoji: {
      id: "null",
      name: "👀",
    },
  },
  // button to call uno - disabled when you have more than 1 card
  {
    style: 1,
    label: "Call UNO",
    custom_id: `uno-call-uno`,
    type: 2,
    disabled: true,
    emoji: {
      id: "null",
      name: "✋",
    },
  },
]);

// debugging
console.log(startingMessage)

// did an error occur?
return false
} catch (errorStartingGame) {
  console.error(errorStartingGame)
  return errorStartingGame
}
