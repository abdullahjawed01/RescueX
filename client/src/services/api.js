import axios from "axios";

const API = axios.create({
  baseURL: "https://rescuex.abdullahjawed.xyz/api"
});

export default API;
