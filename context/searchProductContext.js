"use client";

import { getProducts } from "lib/product";
import { useSearchParams } from "next/navigation";
import { useNotificationContext } from "./notificationContext";

const {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} = require("react");

const searchProductContext = createContext();

export const SearchProductProvider = ({ children }) => {
  const [querys, setQuerys] = useState([]);
  const [search, setSearch] = useState(null);
  const [products, setProducts] = useState([]);
  const [paginate, setPaginate] = useState(null);
  const searchParams = useSearchParams();
  const { setContentLoad } = useNotificationContext();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const removeQuery = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const buildQuerys = () => {
    let query = "";
    let fields = [];

    const searchFields = [
      "categoryname",
      "minprice",
      "maxprice",
      "sort",
      "name",
    ];

    searchFields.map((field) => {
      if (searchParams.get(field)) {
        query += `${field}=${searchParams.get(field)}&`;
        if (
          searchParams.get(field) &&
          searchParams.get(field).split(",").length > 0
        ) {
          searchParams
            .get(field)
            .split(",")
            .map((el) => fields.push({ name: field, data: el }));
        }
      } else {
        query += `${field}=&`;
      }
    });

    setQuerys(fields);
    return query;
  };

  useEffect(() => {
    setContentLoad(true);
    const fetchDatas = async () => {
      const qrys = buildQuerys();
      setQuerys(qrys);

      const { products, pagination } = await getProducts(qrys);

      setProducts(products);
      setPaginate(pagination);
      setContentLoad(false);
    };

    fetchDatas().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let query = "";
    let fields = [];

    const searchFields = [
      "categoryname",
      "minprice",
      "maxprice",
      "sort",
      "name",
    ];

    searchFields.map((field) => {
      if (searchParams.get(field)) {
        query += `${field}=${searchParams.get(field)}&`;
        if (
          searchParams.get(field) &&
          searchParams.get(field).split(",").length > 0
        ) {
          searchParams
            .get(field)
            .split(",")
            .map((el) => fields.push({ name: field, data: el }));
        }
      } else {
        query += `${field}=&`;
      }
    });

    const fetchData = async (qrys) => {
      setContentLoad(true);
      const { products, pagination } = await getProducts(qrys);
      setProducts(products);
      setPaginate(pagination);
      setContentLoad(false);
    };

    if (query != "") {
      setQuerys(fields);
      fetchData(query).catch((err) => console.log(err));
    }
  }, [searchParams]);

  return (
    <searchProductContext.Provider
      value={{
        querys,
        search,
        setQuerys,
        setSearch,
        paginate,
        products,
        removeQuery,
        createQueryString,
        buildQuerys,
        setPaginate,
        setProducts,
      }}
    >
      {children}
    </searchProductContext.Provider>
  );
};

export const useSearchProductContext = () => useContext(searchProductContext);
