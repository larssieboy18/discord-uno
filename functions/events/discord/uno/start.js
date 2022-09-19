try {
  const uno_deck = require('../../../../helpers/others/uno_deck.json');
  const { unoCards } = require('../../../../helpers/others/uno_cards.json');
  const { shuffle, getCardByName } = require('../../../../helpers/others/functions.js');
  const kv = require('../../../../helpers/kv/functions.js');
  const messages = require('../../../../helpers/channels/messages/functions.js');

  // debugging - provide test data while debugging
  let context = {
    params: {
      game: {
        gameChannel: `976400262677803018`,
        players: [
          {
            id: `119473151913623552`,
          },
          {
            id: `793188304764928023`,
          },
          {
            id: `975790862539825164`,
          },
          {
            id: `976400332299063366`,
          }
        ]
      },
      event: {
        guild_id: `975789410186567730`,
      },
    },
  }

  // TODO remove test data before pushing merging to master
  // lines: 8,26
  // labels: development
  // assignees: larssieboy18

  // get channel id from context (this is the channel where the game is being played)
  let { gameChannel } = context.params.game

  // get guild id
  let { guild_id } = context.params.event

  // get playerlist from context (array of player objects)
  let playerlist = context.params.game.players

  // create starting deck
  let startingDeck = await shuffle(uno_deck);

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
    playerHands[i] = startingDeck.slice(0, 7);
  }

  // create discard pile
  let discardPile = [];

  // add first card to discard pile
  discardPile.push(startingDeck.pop());

  // pick a random player from playerlist that starts the game
  let startingPlayer = playerlist[Math.floor(Math.random() * playerlist.length)];

  // create a list of players in the order that they will go
  let playerOrder = playerlist.slice(playerlist.indexOf(startingPlayer)).concat(playerlist.slice(0, playerlist.indexOf(startingPlayer)));
  console.log(playerOrder)

  // create game object
  let game = {
    channel: gameChannel, // channel where the game is being played
    playerlist: playerlist, // array of player objects
    playerHands: playerHands, // object with player ids as keys and arrays of cards as values
    playerOrder: playerOrder, // array of player objects in the order that they will go
    discardPile: discardPile, // discard pile has one card at the start of the game
    drawPile: startingDeck, // draw pile is the remaining cards after the first card has been added to the discard pile and player hands have been dealt
    currentPlayer: startingPlayer, // player object of the player that starts the game
    direction: 1, // reverse (⬅️ & ➡️) OR (⬆️ & ⬇️) : 1 = normal, -1 = reverse
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

  // // debugging
  // console.log(game);
  // console.log(game.playerHands);

  // save game to kv
  await kv.set(`gameDetails-UNO-${guild_id}-${gameChannel}`, game, 604800 /* a week */);

  // TODO add buttons to starting message
  // labels: enhancement
  // assignees: larssieboy18
  // lines: 86,105

  console.log(discardPile[0])
  // send starting message to game channel
  let startingMessage = await messages.create(gameChannel, '', [
    {
      title: "UNO",
      description: `**<@${startingPlayer.id}>** starts the game!`,
      color: 0x00ff00,
      fields: [
        {
          name: "Current Player",
          value: `<@${startingPlayer.id}>`,
          inline: true,
        },
        // player order including the direction
        {
          name: "Player Order",
          value: `${playerOrder.map(player => `<@${player.id}>`).join(`\n`)}`,
          inline: true,
        },
        {
          name: "Direction",
          value: `${game.direction === 1 ? `⬇️` : `⬆️`}`,
          inline: true,
        },
        /* Creating a field with the name "Player Hands" and show how many cards every player has left */
        {
          name: "Player Hands",
          value: `${playerlist.map(player => `<@${player.id}>: ${playerHands[playerlist.indexOf(player)].length} cards`).join(`\n`)}`,
          inline: true,
        },
        {
          name: "Discard Pile",
          value: `${discardPile.length} cards`,
          inline: true,
        },
        {
          name: "Draw Pile",
          value: `${startingDeck.length} cards`,
          inline: true,
        },
        {
          name: "Current Card",
          value: `${(await getCardByName(discardPile[0])).emoji} ${(await getCardByName(discardPile[0])).name}`,
          inline: false,
        },
      ],
      image: {
        url: `${(await getCardByName(discardPile[0])).url}`,
        proxy_url: `${(await getCardByName(discardPile[0])).url}`,
      },
    },
  ], []);

  // TODO Change description of embed when it is not the start of the game anymore
  // lines: 120
  // labels: development
  // assignees: larssieboy18
  // Currently, the message shows a message saying that the player that starts the game starts the game. For consequent turns, it should be altered to show that it is someones turn instead of the person starting a game.

  // debugging
  console.log(startingMessage)

  // did an error occur?
  return false

} catch (errorStartingGame) {
  console.error(errorStartingGame)
  return errorStartingGame
}
