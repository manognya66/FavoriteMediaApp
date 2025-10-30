import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change port if your backend runs on a different one
});

export default API;
