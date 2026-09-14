import axios from "axios";

const axiosDetails = axios.create({
    baseURL:process.env.base_url,
    headers:{
        "Content-Type":"application/json"
    }
});

console.log("ggggggggggggggggg",process.env.base_url)

export default axiosDetails