require('dotenv').config({path: __dirname + '/.env'})

//go to https://developer.twitter.com/en/apps (you must have a developer account.)
module.exports = {
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};
