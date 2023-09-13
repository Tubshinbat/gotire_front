import base from "./base";
import axios from "../axios-base";
import fetcher from "fetcher";

export const revalidate = 60;

export const getSetProduct = async (slug) => {
  let product = null;

  const result = await fetcher(`${base.apiUrl}/setproducts/${slug}`, {
    next: { revalidate: 10 },
  });
  if (result) {
    product = result.data;
  }
  return { product };
};

export const getProducts = async (query) => {
  let products = [];
  let error = null;
  let pagination = {};

  const result = await fetcher(`${base.apiUrl}/products?status=true&${query}`, {
    next: { revalidate: 10 },
  });
  if (result) {
    products = result.data;
    pagination = result.pagination;
  }

  return { products, pagination, error };
};

export const getProduct = async (slug) => {
  let product = null;
  const result = await fetcher(`${base.apiUrl}/products/${slug}`, {
    next: { revalidate: 10 },
  });
  if (result) {
    product = result.data;
  }

  return { product };
};
