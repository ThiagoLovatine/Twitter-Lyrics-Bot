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
        } else {
            console.log(content);
        };
    });
}

const postTweetImg = (content) => {
    var b64content = fs.readFileSync('./juliajacklin.jpg', { encoding: 'base64' })

    // first we must post the media to Twitter
    Bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var meta_params = { media_id: mediaIdStr, alt_text: { text: content } }

        Bot.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = { status: content , /* media_ids: [mediaIdStr] */}

                Bot.post('statuses/update', params, function (err, data, response) {
                    console.log(data)
                })
            }
        })
    })
}

function tweet() {
    fs.readFile('lyrics.txt', 'utf8', function (error, lyrics) {
        if (error) {
            console.log(error.message);
        } else {
            let result = selectLines(lyrics);
            postTweetImg(result);
        }
    });
}

tweet();

setInterval(() => {
    tweet();
}, 60000 * 60 * 1)