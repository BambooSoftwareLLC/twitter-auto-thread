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
      "culpa qui officia deserunt mollit anim id est laborum" +
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

  it("should work for 2-8-2022 - Reading 1", () => {
    const text = `Solomon stood before the altar of the LORD
in the presence of the whole community of Israel,
and stretching forth his hands toward heaven,
he said, \"LORD, God of Israel,
there is no God like you in heaven above or on earth below;
you keep your covenant of mercy with your servants
who are faithful to you with their whole heart.

\"Can it indeed be that God dwells on earth?
If the heavens and the highest heavens cannot contain you,
how much less this temple which I have built!
Look kindly on the prayer and petition of your servant, O LORD, my God,
and listen to the cry of supplication which I, your servant,
utter before you this day.
May your eyes watch night and day over this temple,
the place where you have decreed you shall be honored;
may you heed the prayer which I, your servant, offer in this place.
Listen to the petitions of your servant and of your people Israel
which they offer in this place.
Listen from your heavenly dwelling and grant pardon.\"`;

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(6);

    expect(tweets[0].text).to.equal(`Solomon stood before the altar of the LORD
in the presence of the whole community of Israel,
and stretching forth his hands toward heaven,
he said,`);

    expect(tweets[1].text).to.equal(`"LORD, God of Israel,
there is no God like you in heaven above or on earth below;
you keep your covenant of mercy with your servants
who are faithful to you with their whole heart.`);

    expect(tweets[2].text).to.equal(`"Can it indeed be that God dwells on earth?
If the heavens and the highest heavens cannot contain you,
how much less this temple which I have built!`);

    expect(tweets[3].text).to.equal(`Look kindly on the prayer and petition of your servant, O LORD, my God,
and listen to the cry of supplication which I, your servant,
utter before you this day.`);

    expect(tweets[4].text).to.equal(`May your eyes watch night and day over this temple,
the place where you have decreed you shall be honored;
may you heed the prayer which I, your servant, offer in this place.`);

    expect(tweets[5].text).to.equal(`Listen to the petitions of your servant and of your people Israel
which they offer in this place.
Listen from your heavenly dwelling and grant pardon."`);
  });

  it("should work for 2-8-2022 - Responsorial Psalm", () => {
    const text = `R. (2) How lovely is your dwelling place, Lord, mighty God!
My soul yearns and pines
for the courts of the LORD.
My heart and my flesh
cry out for the living God.
R. How lovely is your dwelling place, Lord, mighty God!
Even the sparrow finds a home,
and the swallow a nest
in which she puts her young—
Your altars, O LORD of hosts,
my king and my God!
R. How lovely is your dwelling place, Lord, mighty God!
Blessed they who dwell in your house!
continually they praise you.
O God, behold our shield,
and look upon the face of your anointed.
R. How lovely is your dwelling place, Lord, mighty God!
I had rather one day in your courts
than a thousand elsewhere;
I had rather lie at the threshold of the house of my God
than dwell in the tents of the wicked.
R. How lovely is your dwelling place, Lord, mighty God!`;

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(4);

    expect(tweets[0].text).to.equal(`R. (2) How lovely is your dwelling place, Lord, mighty God!
My soul yearns and pines
for the courts of the LORD.
My heart and my flesh
cry out for the living God.
R. How lovely is your dwelling place, Lord, mighty God!`);

    expect(tweets[1].text).to.equal(`Even the sparrow finds a home,
and the swallow a nest
in which she puts her young—
Your altars, O LORD of hosts,
my king and my God!
R. How lovely is your dwelling place, Lord, mighty God!
Blessed they who dwell in your house!
continually they praise you.`);

    expect(tweets[2].text).to.equal(`O God, behold our shield,
and look upon the face of your anointed.
R. How lovely is your dwelling place, Lord, mighty God!`);

    expect(tweets[3].text).to.equal(`I had rather one day in your courts
than a thousand elsewhere;
I had rather lie at the threshold of the house of my God
than dwell in the tents of the wicked.
R. How lovely is your dwelling place, Lord, mighty God!`);
  });

  it("should work for 2-8-2022 - Gospel", () => {
    const text = `When the Pharisees with some scribes who had come from Jerusalem
gathered around Jesus,
they observed that some of his disciples ate their meals
with unclean, that is, unwashed, hands.
(For the Pharisees and, in fact, all Jews,
do not eat without carefully washing their hands,
keeping the tradition of the elders.
And on coming from the marketplace
they do not eat without purifying themselves.
And there are many other things that they have traditionally observed,
the purification of cups and jugs and kettles and beds.)
So the Pharisees and scribes questioned him,
"Why do your disciples not follow the tradition of the elders
but instead eat a meal with unclean hands?"
He responded,
"Well did Isaiah prophesy about you hypocrites,
as it is written:

*This people honors me with their lips,
but their hearts are far from me;
In vain do they worship me,
teaching as doctrines human precepts.*

You disregard God's commandment but cling to human tradition."
He went on to say,
"How well you have set aside the commandment of God
in order to uphold your tradition!
For Moses said,
*Honor your father and your mother*,
and *Whoever curses father or mother shall die.*
Yet you say,
'If someone says to father or mother,
"Any support you might have had from me is *qorban*"'
(meaning, dedicated to God),
you allow him to do nothing more for his father or mother.
You nullify the word of God
in favor of your tradition that you have handed on.
And you do many such things."`;

    const tweets = buildTweets(text);
    expect(tweets.length).to.equal(8);

    expect(tweets[0].text).to.equal(`When the Pharisees with some scribes who had come from Jerusalem
gathered around Jesus,
they observed that some of his disciples ate their meals
with unclean, that is, unwashed, hands.`);

    expect(tweets[1].text).to.equal(`(For the Pharisees and, in fact, all Jews,
do not eat without carefully washing their hands,
keeping the tradition of the elders.
And on coming from the marketplace
they do not eat without purifying themselves.`);

    expect(tweets[2].text).to.equal(`And there are many other things that they have traditionally observed,
the purification of cups and jugs and kettles and beds.)
So the Pharisees and scribes questioned him,`);

    expect(tweets[3].text).to.equal(`"Why do your disciples not follow the tradition of the elders
but instead eat a meal with unclean hands?"
He responded,`);

    expect(tweets[4].text).to.equal(`"Well did Isaiah prophesy about you hypocrites,
as it is written:

*This people honors me with their lips,
but their hearts are far from me;
In vain do they worship me,`);

    expect(tweets[5].text).to.equal(`teaching as doctrines human precepts.*

You disregard God's commandment but cling to human tradition."
He went on to say,`);

    expect(tweets[6].text).to.equal(`"How well you have set aside the commandment of God
in order to uphold your tradition!
For Moses said,
*Honor your father and your mother*,
and *Whoever curses father or mother shall die.*
Yet you say,
'If someone says to father or mother,`);

    expect(tweets[7].text).to.equal(`"Any support you might have had from me is *qorban*"'
(meaning, dedicated to God),
you allow him to do nothing more for his father or mother.
You nullify the word of God
in favor of your tradition that you have handed on.
And you do many such things."`);
  });
});
