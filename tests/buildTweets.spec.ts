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
});
