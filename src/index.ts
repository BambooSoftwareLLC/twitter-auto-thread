import { SendTweetV2Params } from "twitter-api-v2";
import Tokenizer from "sentence-tokenizer";

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

const maxLength = 250;

export function buildTweets(paragraph: string): SendTweetV2Params[] {
  // first, split into quotes and non-quotes, maintaining order
  // [
  //   "When David and Saul approached....The women played and sang:\n\n",
  //   "\"Saul has slain his thousands,\nandDavid his ten thousands.\n\"",
  //   "Saul was very angry and resentful of the song, for he though:\n",
  //   "\"They give David ten thousands...is the kingship\"",
  //   "And from that day on, Saul was jealous of David.\n"
  // ]

  // loop by character
  // if a quote is found, end the current chunk (if exists) and start a "quote group"
  const chunks: Chunk[] = [{ text: "", type: "normal" }];
  let skipSpace = false;
  for (const c of paragraph) {
    let current = chunks[chunks.length - 1];
    
    if (c === '"' && current.type === "quote") {
      current.text += c;
      chunks.push(current);
      current = { text: "", type: "normal" };
      skipSpace = true;
    } else if (c === '"' && current.text.length > 0) {
      current.text = current.text.trim();
      chunks.push(current);
      current = { text: c, type: "quote" };
    } else if (c === '"' && current.text.length === 0) {
      current = { text: c, type: "quote" };
    } else if (c === '"' && current.text.length === 0) {
      current = { text: c, type: "quote" };
    } else if (c === " " && skipSpace) {
      skipSpace = false;
      continue;
    } else {
      current.text += c;
    }
  }

  // try to form a tweet with as many chunks as will fit
  const tweets = getTweetsFromChunks(chunks);
  // if the token is a non-quote followed by a quote, and the combination is too long, then leave off the quote
  // if the token is a quote followed by a non-quote, and the combination is too long, then leave off the non-quote
  // if the token is too long, try to first split it into sentence tokens, and try again
  // if a sentence token is too long, try to split it on intra-sentence punctuation
  // if a split-sentence token is too long, try to split it near the middle of the token

  return tweets;
}

function getTweetsFromChunks(chunks: Chunk[]): SendTweetV2Params[] {
  const tweets: SendTweetV2Params[] = [{ text: "" }];
  for (const chunk of chunks) {
    const tweet = tweets[tweets.length - 1];

    // if chunk is good size, add to tweet
    if ((tweet.text?.length ?? 0) + chunk.text.length <= maxLength) {
      tweet.text += chunk.text;
    }

    // if chunk makes existing tweet too large, try to create new tweet
    else if (
      (tweet.text?.length ?? 0) + chunk.text.length > maxLength &&
      chunk.text.length <= maxLength
    ) {
      tweets.push({ text: chunk.text });
    }

    // if chunk is too large by itself, try to split it
    else {
      const innerChunks = splitChunk(chunk);
      tweets.push(...getTweetsFromChunks(innerChunks));
    }
  }

  return tweets;
}

function splitChunk(chunk: Chunk): Chunk[] {
  // try to split into sentences
  const tokenizer = getTokenizer();
  tokenizer.setEntry(chunk.text);
  const sentences = tokenizer.getSentences();

  if (sentences.every((s) => s.length <= maxLength)) {
    return sentences.map((s) => ({ text: s, type: chunk.type }));
  }

  // then try to split into phrases
  const phrases: string[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxLength) {
      phrases.push(sentence);
    } else {
      phrases.push(...splitIntoPhrases(sentence));
    }
  }

  if (phrases.every((p) => p.length <= maxLength)) {
    return phrases.map((p) => ({ text: p, type: chunk.type }));
  }

  // then just split down the middle until they fit
  const scraps: string[] = [];
  for (const phrase of phrases) {
    if (phrase.length <= maxLength) {
      scraps.push(phrase);
    } else {
      scraps.push(...splitIntoScraps(phrase));
    }
  }

  return scraps.map((s) => ({ text: s, type: chunk.type }));
}

function splitIntoPhrases(sentence: string): string[] {
  // get individual tokens
  const tokenizer = getTokenizer();
  tokenizer.setEntry(sentence);
  tokenizer.getSentences();
  const tokens = tokenizer.getTokens(0);

  // build atomic phrases (stopping on ',', ';', ':')
  const endsWithPunctuation = (s: string) =>
    s.endsWith(",") ||
    s.endsWith(";") ||
    s.endsWith(":") ||
    s.endsWith(".") ||
    s.endsWith("!") ||
    s.endsWith("?");

  const phrases: string[] = [""];
  for (const token of tokens) {
    let phrase = phrases[phrases.length - 1];

    phrase += ` ${token}`;
    if (endsWithPunctuation(token)) {
      phrases.push("");
    }
  }

  // compose atomic phrases into largest possible phrases
  const fullPhrases: string[] = [""];
  for (const phrase of phrases) {
    let fullPhrase = fullPhrases[fullPhrases.length - 1];

    if (fullPhrase.length + phrase.length <= maxLength) {
      fullPhrase += phrase;
    } else {
      fullPhrases.push(phrase);
    }
  }

  return fullPhrases.filter((p) => p.length > 0);
}

function splitIntoScraps(phrase: string): string[] {
  // keep dividing it by roughly two until it fits

  // get all tokens
  var tokenizer = getTokenizer();
  tokenizer.setEntry(phrase);
  tokenizer.getSentences();
  const tokens = tokenizer.getTokens(0);

  // split down the middle by count
  const splitIndex = Math.ceil(tokens.length / 2);
  const newLeft = tokens.slice(0, splitIndex).join(" ");
  const newRight = tokens
    .slice(splitIndex, tokens.length - splitIndex)
    .join(" ");

  // check that both sub-phrases are valid
  // if any are invalid, split it again recursively
  const scraps: string[] = [];
  if (newLeft.length <= maxLength) {
    scraps.push(newLeft);
  } else {
    scraps.push(...splitIntoScraps(newLeft));
  }

  if (newRight.length <= maxLength) {
    scraps.push(newRight);
  } else {
    scraps.push(...splitIntoScraps(newRight));
  }

  return scraps;
}

function getTokenizer(): Tokenizer {
  return new Tokenizer("gibberish", "gibberish");
}

interface Chunk {
  text: string;
  type: "quote" | "normal";
}
