import base from "./base";
import axios from "../axios-base";
import fetcher from "fetcher";

export const revalidate = 60;

export const getSearchData = async (text) => {
  const result = await axios.post("/search", { name: text });
  return result.data;
};
