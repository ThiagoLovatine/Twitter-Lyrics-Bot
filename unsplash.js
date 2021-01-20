
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY
    //...other fetch options
});


const getPhoto = () => {
    unsplashApi.search
    .getPhotos({ query: "cat", orientation: "landscape" })
    .then(result => {
        console.log(result);
    })
    .catch(() => {
        console.log("something went wrong!");
    });
}

module.exports = getPhoto;