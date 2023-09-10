import base from "./base";
import axios from "../axios-base";
import fetcher from "fetcher";

export const getMakes = async (query) => {
  let makes = [];
  let error = null;
  const result = await fetcher(`${base.apiUrl}/tiremakes?${query}`);
  if (result) makes = result.data;
  return { makes, error };
};

export const getTire = async (slug) => {
  let tire = null;

  const result = await fetcher(`${base.apiUrl}/tires/slug/${slug}`);
  if (result) {
    tire = result.data;
  }

  return { tire };
};

export const getTires = async (query) => {
  let tires = [];
  let pagination = null;
  let error = null;
  const result = await fetcher(`${base.apiUrl}/tires?status=true&${query}`);
  if (result) {
    tires = result.data;
    pagination = result.pagination;
  }
  return { tires, pagination, error };
};

export const getMostTires = async () => {
  let tires = [];
  let error = null;
  const result = await fetcher(`${base.apiUrl}/tires/mostsearch`);
  if (result) tires = result.data;
  return { tires, error };
};

export const getSearch = async (query) => {
  let search = [];
  const result = await fetcher(
    `${base.apiUrl}/tires/search?status=true&${query}`
  );

  if (result) search = result.data;
  return { search };
};

export const getRandomTires = async () => {
  let tires = [];
  const result = await fetcher(`${base.apiUrl}/tires/random`);
  if (result) tires = result.data;

  return tires;
};
