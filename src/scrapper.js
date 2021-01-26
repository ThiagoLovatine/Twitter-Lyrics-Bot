import genius from "./services/genius.mjs";
import helpers from "./services/helpers.mjs";
import fs from 'fs';

const main = async () => {
  let count = 0;
 
  for(let i = 1; i <= 5; i++){
    genius.getSongs({page: i})
    .then((songs) => {
      songs.map(async (item) => {
          await genius.getSong(item.id).then(async (song) => {
              await genius.getLyrics(song.url).then(async (lyrics) => {
                const result = lyrics.querySelector('.song_body-lyrics .lyrics p');
                const content = helpers.cleanLyrics(result);
                if(content){
                    count = count + 1;
                    fs.writeFile('src/lyrics/'+count+'.txt', content, {encoding:'utf8',flag:'w'}, (res) => {
                    
                    });
                }
                
              }).catch((error) => {
                  console.log(error)
              })
          })
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
};

main();
