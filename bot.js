const Twit = require('twit');
const fs = require('fs');
require('dotenv').config();

const Bot = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const selectLines = (lyrics) => {
    const lines = lyrics.split('\n');
    let addLines = randomNum(0, 3);
    let firstLinePosition = randomNum(0, lines.length - 1);
    let firstLine = lines[firstLinePosition];
    let tweet = firstLine;

    for (let count = 1; count <= addLines; count++) {
        if (lines[count + firstLinePosition]) {
            tweet = tweet + "\n" + lines[count + firstLinePosition];
        }
    }
    return tweet;
}

const postTweet = (content) => {
    Bot.post('statuses/update', { status: content }, function (error, tweet, response) {
        if (error) {
            console.log("Error making post. ", error.message);
        } else{
            console.log(content);
        };
    });
}

function tweet() {
    fs.readFile('lyrics.txt', 'utf8', function (error, lyrics) {
        if (error) {
            console.log(error.message);
        } else {
            let result = selectLines(lyrics);
            postTweet(result);
        }
    });
}

tweet();

setInterval( () => {
    tweet();
}, 60000)