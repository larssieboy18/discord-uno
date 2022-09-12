try{
const uno_deck = require('../../../../helpers/others/uno_deck.json');
const { unoCards } = require('../../../../helpers/others/uno_cards.json');
const { shuffle } = require('../../../../helpers/others/functions.js');
const kv = require('../../../../helpers/kv/functions.js');

// debugging
console.log(context)

// get channel id from context (this is the channel where the game is being played)
let {gameChannel} = context.params.game

// get playerlist from context (array of player objects)
let playerlist = context.params.game.players

// create starting deck
let startingDeck = shuffle(uno_deck);

// create draw pile
let drawPile = [];

 // // create player hands
 // let playerHands = {};

// deal 7 cards to each player
let  playerHands = playerlist.map(player => {
  let hand = [];
  for (let i = 0; i < 7; i++) {
    hand.push(startingDeck.pop());
  }
  return {
    id: player.id,
    hand: hand
  }
})

// for (let i = 0; i < playerlist.length; i++) {
//   let player = playerlist[i];
//   playerHands[player] = [];
//   for (let j = 0; j < 7; j++) {
//     playerHands[player].push(startingDeck.pop());
//   }
// }

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
  playersWithUno: [],
  unoCalled: [], // array of player ids that called uno
  unoMissedCalled: false, // did someone notice that a player missed calling uno?
  unoMissedCalledBy: null, // player who noticed that someone missed calling uno
};

// debugging
console.log(game)
console.log(game.playerHands)

await kv.set(`gameDetails-UNO-${guild_id}-${gameChannel}`, game, 604800 /* a week */);

// did an error occur?
return false
} catch (errorStartingGame) {
  console.error(errorStartingGame)
  return errorStartingGame
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
