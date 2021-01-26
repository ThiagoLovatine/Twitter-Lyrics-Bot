import axios from "axios";
import configs from "../constants/configs.mjs";
import api from "./api.mjs";
import parse from 'node-html-parser';

const getSongs = async (params) => {
  const url = "artists/" + configs.artist_id + "/songs";
  return api(url, params).then((response) => {
    return response.songs;
  });
};

const getSong = async (song_id) => {
  const url = "songs/" + song_id;
  return api(url).then((response) => {
    return response.song;
  });
}

const getLyrics = async (url) => {
  return axios.get(url).then((html) => {
    return parse.parse(html.data);
  });
}

const genius = {
  getSongs,
  getSong,
  getLyrics
};

export default genius;
