import axios from "axios";
const instance = axios.create({
  baseURL: "https://quizapi.etherstaging.xyz/api",
  // baseURL: "https://apiaranya.jumriz.com/public/api",
  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
  },
});

export default instance;
