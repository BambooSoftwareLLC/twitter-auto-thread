import { expect } from "chai";
import { buildTweets } from "../src";

describe("buildTweets", () => {
  it("returns single tweet when input is less than 250 characters", () => {
    const text = (
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
      "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in " +
      "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla " +
      "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in " +
      "culpa qui officia deserunt mollit anim id est laborum."
    ).substring(0, 250);

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(1);
  });

  it("should return more than one tweet for long paragraphs", () => {
    const paragraph =
      "Jonathan then spoke well of David to his father Saul, saying to him:\n" +
      '"Let not your majesty sin against his servant David,\n' +
      "for he has committed no offense against you,\n" +
      "but has helped you very much by his deeds.\n" +
      "When he took his life in his hands and slew the Philistine,\n" +
      "and the LORD brought about a great victory\n" +
      "for all Israel through him,\n" +
      "you were glad to see it.\n" +
      "Why, then, should you become guilty of shedding innocent blood\n" +
      'by killing David without cause?"\n' +
      "Saul heeded Jonathan's plea and swore,\n" +
      '"As the LORD lives, he shall not be killed."\n' +
      "So Jonathan summoned David and repeated the whole conversation to him.\n" +
      "Jonathan then brought David to Saul, and David served him as before.";
    const tweets = buildTweets(paragraph);

    expect(tweets.length).to.be.greaterThan(1);
  });

  it("should split long phrases into scraps of phrases", () => {
    const longPhrase =
      "Lorem ipsum dolor sit amet consectetur adipiscing elit " +
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua " +
      "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris " +
      "nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in " +
      "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla " +
      "pariatur Excepteur sint occaecat cupidatat non proident sunt in " +
      "culpa qui officia deserunt mollit anim id est laborum";

    const tweets = buildTweets(longPhrase);
    expect(tweets.length).to.be.greaterThan(1);
  });

  it("should provide the exact tweets I'm expecting", () => {
    const paragraph =
      "Jonathan then spoke well of David to his father Saul, saying to him:\n" +
      '"Let not your majesty sin against his servant David,\n' +
      "for he has committed no offense against you,\n" +
      "but has helped you very much by his deeds.\n" +
      "When he took his life in his hands and slew the Philistine,\n" +
      "and the LORD brought about a great victory\n" +
      "for all Israel through him,\n" +
      "you were glad to see it.\n" +
      "Why, then, should you become guilty of shedding innocent blood\n" +
      'by killing David without cause?"\n' +
      "Saul heeded Jonathan's plea and swore,\n" +
      '"As the LORD lives, he shall not be killed."\n' +
      "So Jonathan summoned David and repeated the whole conversation to him.\n" +
      "Jonathan then brought David to Saul, and David served him as before.";

    const tweets = buildTweets(paragraph);

    expect(tweets.length).to.equal(4);

    expect(tweets[0].text).to.equal(
      "Jonathan then spoke well of David to his father Saul, saying to him:"
    );
    expect(tweets[1].text).to.equal(
      '"Let not your majesty sin against his servant David,\n' +
        "for he has committed no offense against you,\n" +
        "but has helped you very much by his deeds."
    );
    expect(tweets[2].text).to.equal(
      "When he took his life in his hands and slew the Philistine,\n" +
        "and the LORD brought about a great victory\n" +
        "for all Israel through him,\n" +
        "you were glad to see it.\n" +
        "Why, then, should you become guilty of shedding innocent blood\n" +
        'by killing David without cause?"'
    );
    expect(tweets[3].text).to.equal(
      "Saul heeded Jonathan's plea and swore,\n" +
        '"As the LORD lives, he shall not be killed."\n' +
        "So Jonathan summoned David and repeated the whole conversation to him.\n" +
        "Jonathan then brought David to Saul, and David served him as before."
    );
  });
});
