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
      const { categories: cat } = await getCategory("setproduct");
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
                    onClick={() => handleMultSelect("setOf", set.name)}
                    className={`${
                      activeCheck("setOf", set.name) === true && "active"
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
            <p> Дугуйны мэдээллээр </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.tire &&
                search.tire.tiresizeResult.map((size, index) => (
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
            <p> Улирал </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.tire.season &&
                search.tire.season.map((season) => (
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
            <p> Хувь </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.tire.use &&
                search.tire.use.map((use) => (
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
            <p> Обудын мэдээллээр </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.wheel.diameter &&
                search.wheel.diameter.map((diameter, index) => (
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
                search.wheel.width &&
                search.wheel.width.map((width, index) => (
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
                search.wheel.boltPattern &&
                search.wheel.boltPattern.map((boltPattern, index) => (
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
            <p> Болтны хэмжээ </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.wheel.threadSize &&
                search.wheel.threadSize.map((threadSize, index) => (
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
                search.wheel.centerBore &&
                search.wheel.centerBore.map((centerBore, index) => (
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
            <p> RIM </p>
          </div>
          <div className="search-side-body">
            <div className="search-list">
              {search &&
                search.wheel.rim &&
                search.wheel.rim.map((rim, index) => (
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
