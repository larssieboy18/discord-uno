try {
  const uno_deck = require('../../../../helpers/others/uno_deck.json');
  const { unoCards } = require('../../../../helpers/others/uno_cards.json');
  const { getCardByName } = require('../../../../helpers/others/functions.js');
  const kv = require('../../../../helpers/kv/functions.js');

  let { guild_id } = context.params.event
  let gameChannel = context.params.event.channel_id

  // Get current game data
  await kv.get(`UNO-${guild_id}-${gameChannel}`);

  // did an error occur?
  return false
}
catch (errorDuringTurn) {
  console.log(errorDuringTurn);
  return errorDuringTurn;
}