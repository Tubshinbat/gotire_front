"use client";
import { Slider } from "antd";
import { useSearchSetProductContext } from "context/searchSetProductContext";
import { getCategory } from "lib/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = () => {
  const { search, createQueryString, removeQuery } =
    useSearchSetProductContext();
  const [categories, setCategories] = useState([]);
  const formatter = (value) => `${new Intl.NumberFormat().format(value)}₮`;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const { categories: cat } = await getCategory("product");
      setCategories(cat);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const name = searchParams.get("name");
    name && queryBuild("name", name);
  }, [searchParams]);

  const queryBuild = (name, value, isSame = false) => {
    let query = "?";
    let params = "";
    if (isSame === false) {
      params = createQueryString(name, value);
    } else {
      params = removeQuery(name, value);
    }
    router.push(pathname + query + params);
  };

  const handleMultSelect = (name, value) => {
    let isSame = false;
    let params = searchParams.get(name);
    let setParams = [];

    if (params) {
      setParams = params.split(",");
    }

    if (setParams.length > 0) {
      const filter = setParams.filter((el) => el == value);
      if (filter.length > 0) {
        filter.map((same) =>
          setParams.splice(
            setParams.findIndex((e) => e === same),
            1
          )
        );
      } else {
        setParams.push(value);
      }
    } else {
      setParams.push(value);
    }

    queryBuild(name, setParams, isSame);
  };

  const handlePrice = (checked) => {
    if (checked) {
      const min = searchParams.get("minprice");

      if (parseInt(min) === checked[0]) {
        queryBuild("maxprice", checked[1]);
      } else {
        queryBuild("minprice", checked[0]);
      }
    }
  };

  const activeCheck = (name, value) => {
    let params = searchParams.get(name);
    let setParams = [];

    if (params) {
      setParams = params.split(",");
    }

    const filter = setParams.filter((el) => el == value);
    if (filter.length > 0) return true;
    else return false;
  };

  return (
    <>
      <div className="product-search-side ">
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Ангилал </p>
          </div>
          <div className="search-side-body">
            <div className="search-list list-full">
              {categories &&
                categories.map((category, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect(
                        "categoryname",
                        `${category.name.toLowerCase()}`
                      )
                    }
                    className={`categoryname ${
                      activeCheck(
                        "categoryname",
                        `${category.name.toLowerCase()}`
                      ) === true && "active"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
