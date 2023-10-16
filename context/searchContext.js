"use client";
import axios from "axios";
import { getSearch, getTires } from "lib/tire";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNotificationContext } from "./notificationContext";

const searchContext = createContext({});

export const SearchProvider = ({ children }) => {
  const [car, setCar] = useState(null);
  const [querys, setQuerys] = useState(null);
  const [search, setSearch] = useState(null);
  const [tires, setTires] = useState([]);
  const [paginate, setPaginate] = useState(null);
  const searchParams = useSearchParams();
  const { setContentLoad } = useNotificationContext();
  const [wheelsize, setWheelsize] = useState(null);

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
      "make",
      "tiresize",
      "use",
      "season",
      "setof",
      "minprice",
      "maxprice",
      "sort",
      "categoryname",
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
      const { search: result } = await getSearch(qrys);
      const { tires, pagination } = await getTires(qrys);
      setSearch(result);
      setTires(tires);
      setPaginate(pagination);
      setContentLoad(false);
    };

    fetchDatas().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let query = "";
    let fields = [];

    const searchFields = [
      "make",
      "tiresize",
      "use",
      "season",
      "setof",
      "minprice",
      "maxprice",
      "sort",
      "categoryname",
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
      const { search: result } = await getSearch(qrys);
      const { tires, pagination } = await getTires(qrys);
      setSearch(result);
      setTires(tires);
      setPaginate(pagination);
      setContentLoad(false);
    };

    if (query != "") {
      setQuerys(fields);
      fetchData(query).catch((err) => console.log(err));
    }
  }, [searchParams]);

  // useEffect(() => {
  //   let query = "";
  //   const fields = ["carmake", "carmodel", "caryear", "caroption"];

  //   fields.map((field) => {
  //     const data = searchParams.get(field);
  //     if (field === "carmake") query += `make=${data}&`;
  //     if (field === "carmodel") query += `model=${data}&`;
  //     if (field === "caryear") query += `year=${data}&`;
  //     if (field === "caroption") query += `modification=${data}&`;
  //   });
  //   query += `user_key=5c53c728656ad6ab73949f3ff71230c8`;

  //   const fetchData = async () => {
  //     const result = await axios.get(
  //       `https://api.wheel-size.com/v2/search/by_model/?${query}`
  //     );
  //     console.log(result);
  //     if (result) {
  //       const carData = result.data.data;

  //       setCar(carData[0]);

  //       let wheels = carData[0].wheels;
  //       // carData[0].map((car) => {
  //       //   wheels = [...car.wheels];
  //       // });

  //       if (wheels && wheels.length > 0) {
  //         let tiresizes = "";

  //         wheels.map((wheel) => {
  //           tiresizes += wheel.front.tire + ",";
  //         });
  //         setWheelsize(tiresizes.slice(0, -1));
  //       }
  //     }
  //   };

  //   if (query || query !== "user_key=5c53c728656ad6ab73949f3ff71230c8") {
  //     fetchData().catch((err) => console.log(err));
  //   }
  // }, [searchParams]);

  return (
    <searchContext.Provider
      value={{
        car,
        querys,
        search,
        setCar,
        setQuerys,
        setSearch,
        tires,
        paginate,
        removeQuery,
        createQueryString,
        buildQuerys,
        setTires,
        setPaginate,
        wheelsize,
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

export const useSearchContext = () => useContext(searchContext);
