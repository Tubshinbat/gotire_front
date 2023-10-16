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

export const getSetProducts = async (query) => {
  let setproducts = [];
  let error = null;
  let pagination = {};

  const result = await fetcher(
    `${base.apiUrl}/setproducts?status=true&${query}`,
    {
      next: { revalidate: 10 },
    }
  );
  if (result) {
    setproducts = result.data;
    pagination = result.pagination;
  }

  return { setproducts, pagination, error };
};

export const getProductCategories = async () => {
  let categories = [];
  const result = await fetcher(`${base.apiUrl}/productcategories`);

  if (result) categories = result.data;
  return { categories };
};

export const getSetProductSearch = async (query) => {
  let search = [];
  const result = await fetcher(
    `${base.apiUrl}/setproducts/search?status=true&${query}`
  );

  if (result) search = result.data;
  return { search };
};
