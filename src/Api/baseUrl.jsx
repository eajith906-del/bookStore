import axios from "axios";

const axiosDetails = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("BASE URL:", process.env.REACT_APP_BASE_URL);

export default axiosDetails;