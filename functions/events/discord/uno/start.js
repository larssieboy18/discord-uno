try{
const uno_deck = require('../../../../helpers/others/uno_deck.json');
const { unoCards } = require('../../../../helpers/others/uno_cards.json');
const { shuffle } = require('../../../../helpers/others/functions.js');

// debugging
console.log(context)

// create deck
let startingDeck = shuffle(uno_deck);

// create draw pile
let drawPile = [];

// create player hands
let playerHands = {};

// deal 7 cards to each player
for (let i = 0; i < playerlist.length; i++) {
  let player = playerlist[i];
  playerHands[player] = [];
  for (let j = 0; j < 7; j++) {
    playerHands[player].push(startingDeck.pop());
  }
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
  playerlist: playerlist,
  playerHands: playerHands,
  drawPile: drawPile,
  discardPile: discardPile,
  currentPlayer: startingPlayer,
  direction: 1, // reverse
  drawTwo: 0, // +2
  skip: 0, // skip
  wildColor: null, // color change because of wildcard
  colorChangeBy: null, // player who changed the color
  wildDrawFour: 0, // +4
  uno: false,
  unoCalled: false,
  unoCalledBy: null,
  unoMissedCalled: false,
  unoMissedCalledBy: null,
  unoMissedCalledOn: null,
}

return `succesfully started the game`
} catch (errorStartingGame) {
  console.error(errorStartingGame)
  return `There was an error starting the game. If this keeps happening, please report this on our Github page https://github.com/larssieboy18/discord-uno/issues and include the following error message: \`${errorStartingGame}\``



return `Succesful or not?`









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
