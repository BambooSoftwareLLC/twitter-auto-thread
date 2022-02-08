import { SendTweetV2Params, TweetV2PostTweetResult, TwitterApiReadWrite } from "twitter-api-v2";
import Tokenizer from "sentence-tokenizer";

export class TwitterAutoThreadClient {
  constructor(private authenticatedClient: TwitterApiReadWrite) {}

  public async tweetThreadOfParagraphs(paragraphs: string[]): Promise<void> {
    const tweets = paragraphs.flatMap((p) => buildTweets(p));
    await this.tweetThread(tweets);
  }

  public async tweetThread(tweets: SendTweetV2Params[], beforeEach?: (tweet: SendTweetV2Params) => void): Promise<void> {
    let lastTweet: TweetV2PostTweetResult | null = null;
    for (const tweet of tweets) {
      if (!!beforeEach) {
        beforeEach(tweet);
      }

      if (!!lastTweet) {
        tweet.reply = { in_reply_to_tweet_id: lastTweet.data.id };
      }

      lastTweet = await this.authenticatedClient.v2.tweet(tweet);
    }
  }
}

const maxLength = 280;

export function buildTweets(paragraph: string): SendTweetV2Params[] {
  // loop by character
  // if a quote is found, end the current chunk (if exists) and start a "quote group"
  const chunks: Chunk[] = [{ text: "", type: "normal" }];

  for (let i = 0; i < paragraph.length; i++) {
    const c = paragraph[i];
    const c2 = i < paragraph.length - 1 ? paragraph[i + 1] : c;
    let current = chunks[chunks.length - 1];

    // check if the quote ends
    const nextIsInnerQuote = !!c2.match(/[a-zA-Z]/);
    if (c === '"' && current.type === "quote" && !nextIsInnerQuote) {
      current.text += c;
      chunks.push({ text: "", type: "normal" });
    } else if (c === '"' && current.text.length > 0) {
      chunks.push({ text: c, type: "quote" });
    } else if (c === '"' && current.text.length === 0) {
      current = { text: c, type: "quote" };
    } else {
      current.text += c;
    }
  }

  // try to form a tweet with as many chunks as will fit
  // if the token is a non-quote followed by a quote, and the combination is too long, then leave off the quote
  // if the token is a quote followed by a non-quote, and the combination is too long, then leave off the non-quote
  // if the token is too long, try to first split it into sentence tokens, and try again
  // if a sentence token is too long, try to split it on intra-sentence punctuation
  // if a split-sentence token is too long, try to split it near the middle of the token
  const tweets = getTweetsFromChunks(chunks);

  return tweets.filter((t) => !!t.text && t.text.length > 0);
}

function getTweetsFromChunks(chunks: Chunk[]): SendTweetV2Params[] {
  const tweets: SendTweetV2Params[] = [{ text: "" }];
  for (const chunk of chunks) {
    const tweet = tweets[tweets.length - 1];

    // if chunk is good size, add to tweet
    if ((tweet.text?.length ?? 0) + chunk.text.length <= maxLength) {
      // don't put newline in front of "R."
      tweet.text += tweet.text?.endsWith("R.") ? " " : "\n";
      tweet.text += chunk.text.trim();
    }

    // if chunk makes existing tweet too large, try to create new tweet
    else if ((tweet.text?.length ?? 0) + chunk.text.length > maxLength && chunk.text.length <= maxLength) {
      tweets.push({ text: chunk.text.trim() });
    }

    // if chunk is too large by itself, try to split it
    else {
      const innerChunks = splitChunk(chunk);
      tweets.push(...getTweetsFromChunks(innerChunks));
    }
  }

  return tweets
    .map((t) => ({ text: t.text?.trim() }))
    .map((t) => ({ text: t.text?.replace(/\n'\n/g, "'\n") }))
    .map((t) => ({ text: t.text?.replace(/\n\"\n/g, '"\n') }))
    .map((t) => ({ text: t.text?.replace(/\n\"$/gm, '"') }));
}

function splitChunk(chunk: Chunk): Chunk[] {
  // try to split into sentences
  const tokenizer = getTokenizer();

  // need space before newline or sentences are incorrect
  let text = chunk.text.replace(/\.\n/g, ". \n");
  text = text.replace(/\!\n/g, "! \n");
  text = text.replace(/\?\n/g, "? \n");

  tokenizer.setEntry(text);
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
  const tokens = tokenizer.getTokens(0).flatMap((t) => t.split(/(?<=\r?\n)/));

  // build atomic phrases (stopping on ',', ';', ':')
  const endsWith = [",", ";", ":", ".", "!", "?"].flatMap((t) => [t, `${t}\n`]);
  const endsWithPunctuation = (s: string) => endsWith.some((ew) => s.endsWith(ew));

  const phrases: { text: string }[] = [{ text: "" }];
  for (const token of tokens) {
    let phrase = phrases[phrases.length - 1];

    phrase.text += ` ${token}`;
    if (endsWithPunctuation(token)) {
      phrases.push({ text: "" });
    }
  }

  // compose atomic phrases into largest possible phrases
  const fullPhrases: { text: string }[] = [{ text: "" }];
  for (const phrase of phrases) {
    let fullPhrase = fullPhrases[fullPhrases.length - 1];

    if (fullPhrase.text.length + phrase.text.length <= maxLength) {
      fullPhrase.text += phrase.text;
    } else {
      fullPhrases.push({ ...phrase });
    }
  }

  // trim leading spaces from each line
  const trimmedPhrases = fullPhrases
    .filter((p) => p.text.length > 0)
    .map((p) => p.text)
    .map((p) => p.replace(/\n /g, "\n"));

  return trimmedPhrases;
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
  const newRight = tokens.slice(splitIndex, tokens.length).join(" ");

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
