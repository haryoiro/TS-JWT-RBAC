import axios from 'axios';

// const baseURL = `http://localhost:8000`
const instance = axios.create({
    // baseURL,
    withCredentials: true,
    // headers:{
    //     // "Access-Control-Allow-Origin": "http://localhost:8000"
    // }
})
export default instance