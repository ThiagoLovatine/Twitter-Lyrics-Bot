import dotenv from 'dotenv'
dotenv.config()
import Twit from 'twit';
import unsplash from 'unsplash-js';
import "isomorphic-fetch";
import fs from 'fs';
import request from 'request';
import Jimp from 'jimp';

const Bot = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
 
const unsplashApi = unsplash.createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: fetch
});


const getPhoto = async (query) => {
    return unsplashApi.search
        .getPhotos({ query, orientation: "landscape" })
        .then(data => {
            let imgNum = randomNum(0, data.response.results.length - 1)
            const fileUrl = data.response.results[imgNum].urls.regular.split('?')[0];
            return fileUrl;
        })
        .catch(() => {
            console.log("something went wrong!");
        });
}

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
    return [tweet, firstLine];
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

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const saveTweet = (content) => {
    var b64content = fs.readFileSync('./currentImage.jpg', { encoding: 'base64' });
    Bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
        var mediaIdStr = data.media_id_string
        var meta_params = { media_id: mediaIdStr, alt_text: { text: content } }
        if (err) {
            console.log(err);
        }
        Bot.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                var params = { status: content, media_ids: [mediaIdStr] }
                Bot.post('statuses/update', params, function (err, data, response) {
                    //console.log(content)
                })
            }
        })
    })
}

const generateImagePixel = async (photoUrl, content) => {
    download(photoUrl, 'currentImage.jpg', () => {
        Jimp.read('./currentImage.jpg')
            .then(async image => {
                await image
                    .cover(720, 720)
                    .quality(80)
                    .sepia()
                    .writeAsync('currentImage.jpg');
            }).then(() => {
                saveTweet(content);
            })
            .catch(console.error);
    });
}

const postTweetImg = async (content, query) => {
    const photoUrl = await getPhoto(query);
    generateImagePixel(photoUrl, content);
}

function tweet() {
    const fileNum = randomNum(1, 26);
    const fileName = 'src/lyrics/' + fileNum + '.txt';
    //console.log(fileName);
    fs.readFile(fileName, 'utf8', function (error, lyrics) {
        if (error) {
            console.log(error.message);
        } else {
            let result = selectLines(lyrics);
            postTweetImg(result[0], result[1]);
            //postTweet(result[0]);
        }
    });
}

tweet();

setInterval(() => {
    tweet();
}, 60000 * 60 * 1)
