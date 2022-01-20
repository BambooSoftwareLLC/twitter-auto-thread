import { TweetV2 } from "twitter-api-v2";

// EXAMPLE TEXT
// When David and Saul approached\n
// (on David’s return after slaying the Philistine),\n
// women came out from each of the cities of Israel to meet King Saul,\n
// singing and dancing, with tambourines, joyful songs, and sistrums.\n
// The women played and sang:\n
// \n
//             “Saul has slain his thousands,\n
//             and David his ten thousands.”\n
// \n
// Saul was very angry and resentful of the song, for he thought:\n
// “They give David ten thousands, but only thousands to me.\n
// All that remains for him is the kingship.”\n
// And from that day on, Saul was jealous of David.\n

export function buildTweets(paragraph: string): TweetV2[] {
  // first, split into quotes and non-quotes, maintaining order
  // [
  //   "When David and Saul approached....The women played and sang:\n\n",
  //   "\"Saul has slain his thousands,\nandDavid his ten thousands.\n\"",
  //   "Saul was very angry and resentful of the song, for he though:\n",
  //   "\"They give David ten thousands...is the kingship\"",
  //   "And from that day on, Saul was jealous of David.\n"
  // ]

  // try to form a tweet with as many lines as will fit
  // if the token is a non-quote followed by a quote, and the combination is too long, then leave off the quote
  // if the token is a quote followed by a non-quote, and the combination is too long, then leave off the non-quote
  // if the token is too long, try to first split it into sentence tokens, and try again
  // if a sentence token is too long, try to split it on intra-sentence punctuation
  // if a split-sentence token is too long, try to split it near the middle of the token

  return [
    {
      text: paragraph,
    } as TweetV2,
  ];
}
