import axios from "axios";

const instance = axios.create({
  baseURL: "https://gotire.mn/api/",
  // baseURL: "http://localhost:2001/api/v1/",
});

instance.defaults.withCredentials = true;

export default instance;
