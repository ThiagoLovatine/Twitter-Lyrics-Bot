import axios from "axios";
import configs from "../constants/configs.mjs";

const api = async (url, params = {}, method = "GET") => {
  params.access_token = configs.apiKey;

  const config = {
    params,
    method,
  };

  return axios(configs.apiUrl + url, config)
    .then((res) => {
      return res.data.response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export default api;
