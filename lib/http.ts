import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  // process.env.NODE_ENV === 'development'
  //   ? 'http://localhost:3008'
  //   : 'https://straterpages.onrender.com',
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
