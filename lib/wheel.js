import base from "./base";
import axios from "../axios-base";
import fetcher from "fetcher";

export const getWheel = async (slug) => {
  let wheel = null;

  const result = await fetcher(`${base.apiUrl}/wheels/${slug}`);
  if (result) {
    wheel = result.data;
  }

  return { wheel };
};

export const getWheels = async (query) => {
  let wheels = [];
  let pagination = null;
  let error = null;
  const result = await fetcher(`${base.apiUrl}/wheels?status=true&${query}`);
  if (result) {
    wheels = result.data;
    pagination = result.pagination;
  }
  return { wheels, pagination, error };
};

export const getWheelSearch = async (query) => {
  let search = [];
  const result = await fetcher(`${base.apiUrl}/wheels/search?${query}`);

  if (result) search = result.data;
  return { search };
};
