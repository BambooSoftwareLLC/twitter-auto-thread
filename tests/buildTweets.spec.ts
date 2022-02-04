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

    expect(tweets[0].text).to.equal("Jonathan then spoke well of David to his father Saul, saying to him:");
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

  it("should work for 2-2-2022", () => {
    const text = `Thus says the Lord GOD:
Lo, I am sending my messenger
to prepare the way before me;
And suddenly there will come to the temple
the Lordwhom you seek,
And the messenger of the covenant whom you desire.
Yes, he is coming, says the Lordof hosts.
But who will endure the day of his coming?
And who can stand when he appears?
For he is like the refiner's fire,
or like the fuller's lye.
He will sit refining and purifying silver,
and he will purify the sons of Levi,
Refining them like gold or like silver
that they may offer due sacrifice to the Lord.
Then the sacrifice of Judah and Jerusalem
will please the Lord,
as in the days of old, as in years gone by.`;

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(4);
  });

  it("should work for 2-3-2022", () => {
    const text = `When the time of David's death drew near,
he gave these instructions to his son Solomon:
\"I am going the way of all flesh.
Take courage and be a man.
Keep the mandate of the Lord, your God, following his ways
and observing his statutes, commands, ordinances, and decrees
as they are written in the law of Moses,
that you may succeed in whatever you do,
wherever you turn, and the Lord may fulfill
the promise he made on my behalf when he said,
'If your sons so conduct themselves
that they remain faithful to me with their whole heart
and with their whole soul,
you shall always have someone of your line
on the throne of Israel.'\"

David rested with his ancestors and was buried in the City of David.
The length of David's reign over Israel was forty years:
he reigned seven years in Hebron
and thirty-three years in Jerusalem.

Solomon was seated on the throne of his father David,
with his sovereignty firmly established.`;

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(6);

    expect(tweets[0].text).to.equal(`When the time of David's death drew near,
he gave these instructions to his son Solomon:`);

    expect(tweets[1].text).to.equal(`\"I am going the way of all flesh.
Take courage and be a man.`);

    expect(tweets[2].text).to.equal(`Keep the mandate of the Lord, your God, following his ways
and observing his statutes, commands, ordinances, and decrees
as they are written in the law of Moses,
that you may succeed in whatever you do,
wherever you turn,`);

    expect(tweets[3].text).to.equal(`and the Lord may fulfill
the promise he made on my behalf when he said,
'If your sons so conduct themselves
that they remain faithful to me with their whole heart
and with their whole soul,
you shall always have someone of your line
on the throne of Israel.'\"`);

    expect(tweets[4].text).to.equal(`David rested with his ancestors and was buried in the City of David.
The length of David's reign over Israel was forty years:
he reigned seven years in Hebron
and thirty-three years in Jerusalem.`);

    expect(tweets[5].text).to.equal(`Solomon was seated on the throne of his father David,
with his sovereignty firmly established.`);
  });
});
