const { TwitterApi }  = require("twitter-api-v2");
require('dotenv').config({path: __dirname + '/.env'})

const client =  new TwitterApi({

    appKey: process.env.TWITTER_API_KEY ,
    appSecret: process.env.TWITTER_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const rwClient = client.readWrite;

module.exports = rwClient;