"use client";
import {
  faAnglesRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "app/loading";
import NotFound from "components/Generals/Notfound";
import GoogleAnalytics from "components/GoogleAnalytics";
import base from "lib/base";
import { getSearchData } from "lib/search";

import { getWebInfo } from "lib/webinfo";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";

export default async function Page() {
  const searchParams = useSearchParams();
  const [tires, setTires] = useState([]);
  const [products, setProduct] = useState([]);
  const [wheels, setWheels] = useState([]);
  const [setproducts, setSetProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchData, setSearchData] = useState({});
  const pathname = usePathname();
  const searchText = useRef();

  useEffect(() => {
    const name = searchParams.get("name");

    const fetchData = async (text) => {
      const { tires, products, wheels, setProducts } = await getSearchData(
        text
      );
      setTires(tires);
      setProduct(products);
      setWheels(wheels);
      setSetProducts(setProducts);
      setLoading(() => false);
    };

    if (name) {
      fetchData(name).catch((error) => console.log(error));
      setLoading(() => false);
    } else {
      setLoading(() => false);
    }
  }, []);

  const handleSearch = () => {
    router.replace(`/search?name=${searchText.current.value}`);
  };

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) setSearchData((bs) => ({ ...bs, name }));
    else setSearchData((bs) => ({ ...bs, name: "" }));
  }, [searchParams]);

  return (
    <div>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}
      <main>
        <Suspense fallback={<Loading />}>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="search-main search-mobile">
                    <input
                      className="search-input"
                      name="search"
                      placeholder="Хайлт хийхдээ 195/65/15, Хол 5-14 г.м"
                      ref={searchText}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <button className="search-btn" onClick={handleSearch}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>
                  <h6 className="search-key">
                    Хайлт: {searchParams.get("name")}
                  </h6>
                  {loading && <ContentLoader />}
                  <div className="row ">
                    {tires && tires.length > 0 && (
                      <Link
                        href={`/tires?name=${searchParams.get("name")}`}
                        className="search-title"
                      >
                        Дугуйнууд <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    )}
                    {tires &&
                      tires.map((tire) => (
                        <div className="col-lg-2 col-md-3 col-sm-6 col-6">
                          <Link href={`/tires/${tire._id}`}>
                            <div className="product-item">
                              <div className="product-item-img">
                                <div className="product-item-set">
                                  Ширхэг: {tire.setOf}
                                </div>
                                {tire.pictures && tire.pictures[0] ? (
                                  <img
                                    src={
                                      base.cdnUrl +
                                      "/350x350/" +
                                      tire.pictures[0]
                                    }
                                  />
                                ) : (
                                  <img src="/images/no-product.jpg" />
                                )}
                              </div>
                              <div className="product-item-dtl">
                                <h4>{tire.name}</h4>
                                <div className="product-item-infos">
                                  <li>
                                    Хэмжээ:{" "}
                                    {tire.width +
                                      "/" +
                                      tire.height +
                                      "R" +
                                      tire.diameter}
                                  </li>
                                  <li>Үйлдвэрлэгч: {tire.make.name}</li>
                                </div>
                                <div className="product-item-price">
                                  {tire.isDiscount == true && (
                                    <h4 className="p-discount">
                                      {new Intl.NumberFormat().format(
                                        tire.discount
                                      )}
                                      ₮{" "}
                                      <span>
                                        {" "}
                                        {new Intl.NumberFormat().format(
                                          tire.price
                                        )}
                                        ₮{" "}
                                      </span>
                                    </h4>
                                  )}
                                  {tire.isDiscount == false && (
                                    <h4 className="p-price">
                                      {new Intl.NumberFormat().format(
                                        tire.price
                                      )}
                                      ₮
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>

                  <div className="row ">
                    {wheels && wheels.length > 0 && (
                      <Link
                        href={`/wheels?name=${searchParams.get("name")}`}
                        className="search-title"
                      >
                        Обудууд <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    )}
                    {wheels &&
                      wheels.map((wheel) => (
                        <div className="col-lg-2 col-md-3 col-sm-6 col-6">
                          <Link href={`/wheels/${wheel._id}`}>
                            <div className="product-item">
                              <div className="product-item-img">
                                <div className="product-item-set">
                                  Ширхэг: {wheel.setOf}
                                </div>
                                {wheel.pictures && wheel.pictures[0] ? (
                                  <img
                                    src={
                                      base.cdnUrl +
                                      "/350x350/" +
                                      wheel.pictures[0]
                                    }
                                  />
                                ) : (
                                  <img src="/images/no-product.jpg" />
                                )}
                              </div>
                              <div className="product-item-dtl">
                                <h4>{wheel.name}</h4>
                                <div className="product-item-infos">
                                  <li>Хэмжээ: {wheel.rim}</li>
                                  <li>Болтны зай: {wheel.boltPattern}</li>
                                </div>
                                <div className="product-item-price">
                                  {wheel.isDiscount == true && (
                                    <h4 className="p-discount">
                                      {new Intl.NumberFormat().format(
                                        wheel.discount
                                      )}
                                      ₮{" "}
                                      <span>
                                        {" "}
                                        {new Intl.NumberFormat().format(
                                          wheel.price
                                        )}
                                        ₮{" "}
                                      </span>
                                    </h4>
                                  )}
                                  {wheel.isDiscount == false && (
                                    <h4 className="p-price">
                                      {new Intl.NumberFormat().format(
                                        wheel.price
                                      )}
                                      ₮
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>

                  <div className="row ">
                    {setproducts && setproducts.length > 0 && (
                      <Link
                        href={`/setproducts?name=${searchParams.get("name")}`}
                        className="search-title"
                      >
                        Дугуй, обуд <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    )}
                    {setproducts &&
                      setproducts.map((product) => (
                        <div className="col-lg-2 col-md-3 col-sm-6 col-6">
                          <Link href={`/setproducts/${product._id}`}>
                            <div className="product-item">
                              <div className="product-item-img">
                                <div className="product-item-set">
                                  Ширхэг: {product.setOf}
                                </div>
                                {product.pictures && product.pictures[0] ? (
                                  <img
                                    src={
                                      base.cdnUrl +
                                      "/350x350/" +
                                      product.pictures[0]
                                    }
                                  />
                                ) : (
                                  <img src="/images/no-product.jpg" />
                                )}
                              </div>
                              <div className="product-item-dtl">
                                <h4>{product.name}</h4>
                                <div className="product-item-infos">
                                  <li>
                                    Хэмжээ:{" "}
                                    {product.tire &&
                                      product.tire.width +
                                        "/" +
                                        product.tire.height +
                                        "R" +
                                        product.tire.diameter}
                                  </li>
                                  <li>
                                    Болтны зай:{" "}
                                    {product.wheel && product.wheel.boltPattern}
                                  </li>
                                </div>
                                <div className="product-item-price">
                                  {product.isDiscount == true && (
                                    <h4 className="p-discount">
                                      {new Intl.NumberFormat().format(
                                        product.discount
                                      )}
                                      ₮{" "}
                                      <span>
                                        {" "}
                                        {new Intl.NumberFormat().format(
                                          product.price
                                        )}
                                        ₮{" "}
                                      </span>
                                    </h4>
                                  )}
                                  {product.isDiscount == false && (
                                    <h4 className="p-price">
                                      {new Intl.NumberFormat().format(
                                        product.price
                                      )}
                                      ₮
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                  <div className="row  ">
                    {products && products.length > 0 && (
                      <Link
                        href={`/products?name=${searchParams.get("name")}`}
                        className="search-title"
                      >
                        Бусад <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    )}
                    {products &&
                      products.map((product) => (
                        <div className="col-lg-2 col-md-3 col-sm-6 col-6">
                          <Link href={`/products/${product._id}`}>
                            <div className="product-item">
                              <div className="product-item-img">
                                <div className="product-item-set">
                                  Ширхэг: {product.setOf}
                                </div>
                                {product.pictures && product.pictures[0] ? (
                                  <img
                                    src={
                                      base.cdnUrl +
                                      "/350x350/" +
                                      product.pictures[0]
                                    }
                                  />
                                ) : (
                                  <img src="/images/no-product.jpg" />
                                )}
                              </div>
                              <div className="product-item-dtl">
                                <h4>{product.name}</h4>

                                <div className="product-item-price">
                                  {product.isDiscount == true && (
                                    <h4 className="p-discount">
                                      {new Intl.NumberFormat().format(
                                        product.discount
                                      )}
                                      ₮{" "}
                                      <span>
                                        {" "}
                                        {new Intl.NumberFormat().format(
                                          product.price
                                        )}
                                        ₮{" "}
                                      </span>
                                    </h4>
                                  )}
                                  {product.isDiscount == false && (
                                    <h4 className="p-price">
                                      {new Intl.NumberFormat().format(
                                        product.price
                                      )}
                                      ₮
                                    </h4>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>

                  {[...wheels, ...tires, ...products, ...setproducts].length <=
                    0 &&
                    loading == false && <NotFound />}
                </div>
              </div>
            </div>
          </section>
        </Suspense>
      </main>
    </div>
  );
}
