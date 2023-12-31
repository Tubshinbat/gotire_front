"use client";
import { Slider } from "antd";
import { useSearchWheelContext } from "context/searchWheelContext";
import { getCategory } from "lib/categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchWheelBox = () => {
  const { search, createQueryString, removeQuery, car } =
    useSearchWheelContext();
  const [categories, setCategories] = useState([]);
  const formatter = (value) => `${new Intl.NumberFormat().format(value)}₮`;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    const fetchData = async () => {
      const { categories } = await getCategory("wheel");
      setCategories(categories);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

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
                <p> Таарах стандарт хэмжээнүүд: </p>
                {car.wheels &&
                  car.wheels.map((wheel) => <span> {wheel.front.rim} </span>)}
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
                    className={`${
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
            <p> Диаметр </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.diameter &&
                search.diameter.map((diameter, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect("diameter", `${diameter.name}`)
                    }
                    className={`${
                      activeCheck("diameter", `${diameter.name}`) === true &&
                      "active"
                    }`}
                  >
                    {diameter.name} инч ({diameter.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Өргөн </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.width &&
                search.width.map((width, index) => (
                  <button
                    onClick={() => handleMultSelect("width", `${width.name}`)}
                    className={`${
                      activeCheck("width", `${width.name}`) === true && "active"
                    }`}
                  >
                    {width.name} ({width.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Болтны зай </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.boltPattern &&
                search.boltPattern.map((boltPattern, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect("boltPattern", `${boltPattern.name}`)
                    }
                    className={`${
                      activeCheck("boltPattern", `${boltPattern.name}`) ===
                        true && "active"
                    }`}
                  >
                    {boltPattern.name} ({boltPattern.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> RIM </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.rim &&
                search.rim.map((rim, index) => (
                  <button
                    onClick={() => handleMultSelect("rim", `${rim.name}`)}
                    className={`${
                      activeCheck("rim", `${rim.name}`) === true && "active"
                    }`}
                  >
                    {rim.name} ({rim.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Болтны хэмжээ </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.threadSize &&
                search.threadSize.map((threadSize, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect("threadSize", `${threadSize.name}`)
                    }
                    className={`${
                      activeCheck("threadSize", `${threadSize.name}`) ===
                        true && "active"
                    }`}
                  >
                    {threadSize.name} ({threadSize.count})
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="search-side-item">
          <div className="search-side-title">
            <p> Голын диаметр </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.centerBore &&
                search.centerBore.map((centerBore, index) => (
                  <button
                    onClick={() =>
                      handleMultSelect("centerBore", `${centerBore.name}`)
                    }
                    className={`${
                      activeCheck("centerBore", `${centerBore.name}`) ===
                        true && "active"
                    }`}
                  >
                    {centerBore.name} ({centerBore.count})
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
                search.setOf.map((setOf, index) => (
                  <button
                    onClick={() => handleMultSelect("setOf", `${setOf.name}`)}
                    className={`${
                      activeCheck("setOf", `${setOf.name}`) === true && "active"
                    }`}
                  >
                    {setOf.name} ({setOf.count})
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

export default SearchWheelBox;
