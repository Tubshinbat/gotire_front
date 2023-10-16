"use client";
import { Slider } from "antd";
import { useSearchContext } from "context/searchContext";
import { getCategory } from "lib/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = () => {
  const { search, createQueryString, removeQuery, car } = useSearchContext();
  const [categories, setCategories] = useState([]);
  const formatter = (value) => `${new Intl.NumberFormat().format(value)}₮`;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const { categories } = await getCategory("tire");
      setCategories(categories);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

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

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) queryBuild("name", name);
  }, [searchParams]);

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
        {car && (
          <div className="search-side-item">
            <div className="search-side-title">
              <p> Таны сонгосон машин </p>
            </div>
            <div className="search-side-body car-infos">
              <div className="car-info">
                <p> Үйлдвэрлэгч: </p> <span> {car.make.name}</span>
              </div>
              <div className="car-info">
                <p> Загвар: </p> <span> {car.model.name}</span>
              </div>
              <div className="car-info">
                <p> Төрөл: </p> <span> {car.name}</span>
              </div>
              <div className="car-info-tires">
                <p> Таарах стандарт дугуйнууд: </p>
                {car.wheels &&
                  car.wheels.map((wheel) => <span> {wheel.front.tire} </span>)}
              </div>
            </div>
          </div>
        )}
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

        <div className="search-side-item">
          <div className="search-side-title">
            <p> Хэмжээ </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.tiresize &&
                search.tiresize.map((size, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect(
                        "tiresize",
                        `${size.width}/${size.height}R${size.diameter}`
                      )
                    }
                    className={`${
                      activeCheck(
                        "tiresize",
                        `${size.width}/${size.height}R${size.diameter}`
                      ) === true && "active"
                    }`}
                  >
                    {size.width}/{size.height}R{size.diameter} ({size.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Хувь </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.use &&
                search.use.map((use) => (
                  <button
                    onClick={() => handleMultSelect("use", use.name)}
                    className={`${
                      activeCheck("use", use.name) === true && "active"
                    }`}
                  >
                    {parseInt(use.name) === 100 ? "Шинэ" : use.name + "%"} (
                    {use.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Улирал </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.season &&
                search.season.map((season) => (
                  <button
                    onClick={() => handleMultSelect("season", season.name)}
                    className={`${
                      activeCheck("season", season.name) === true && "active"
                    }`}
                  >
                    {(season.name === "winter" && "Өвлийн") ||
                      (season.name === "summer" && "Зуны") ||
                      (season.name === "allin" && "Дөрвөн улиралын")}{" "}
                    ({season.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Багц </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.setOf &&
                search.setOf.map((set) => (
                  <button
                    onClick={() => handleMultSelect("setof", set.name)}
                    className={`${
                      activeCheck("setof", set.name) === true && "active"
                    }`}
                  >
                    {set.name} ({set.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Үнэ </p>
          </div>
          <div className="search-side-body">
            {search && search.price && (
              <Slider
                range
                tooltip={{
                  formatter,
                }}
                onChange={(checked) => handlePrice(checked)}
                min={search.price[0].min}
                max={search.price[0].max}
                defaultValue={[search.price[0].min, search.price[0].max]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBox;
