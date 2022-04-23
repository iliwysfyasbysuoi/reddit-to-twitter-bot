module.exports = {
  //Enter the names of all the subreddits you want the bot to tweet images from.
  randomSubreddit: function() {
    let subreddits = ['FiftyFifty'];
    return subreddits[Math.floor(Math.random() * subreddits.length)];
  },
  randomPost: function() {
    return Math.floor(Math.random() * 5);
  }
};
