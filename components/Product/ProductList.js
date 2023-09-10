"use client";
import { useSearchProductContext } from "context/searchProductContext";
import base from "lib/base";
import Link from "next/link";
import { Select } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useNotificationContext } from "context/notificationContext";
import BlockLoad from "components/Generals/BlockLoad";

import { getProducts } from "lib/product";

const ProductList = () => {
  const {
    querys,
    createQueryString,
    removeQuery,
    products,
    buildQuerys,
    setProducts,
    setPaginate,
    paginate,
  } = useSearchProductContext();
  const { contentLoad } = useNotificationContext();
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

  const handleDelete = (name, value) => {
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

  const handleChange = (value) => {
    queryBuild("sort", value);
  };
  const nextpage = () => {
    const qry = buildQuerys();

    const next = async () => {
      const { products, pagination } = await getProducts(
        `${qry}page=${paginate.nextPage}`
      );
      setProducts((bs) => [...bs, ...products]);
      setPaginate(pagination);
      // setLoader(false);
    };

    if (paginate && paginate.nextPage) {
      // setLoader(true);
      next().catch((error) => console.log(error));
    }
  };

  return (
    <div className="product-main">
      <div className="product-main-header">
        <h4>
          Бусад сэлбэгүүд
          <span> | нийт {(paginate && paginate.total) || 0}</span>{" "}
        </h4>
        <Select
          defaultValue="new"
          onChange={handleChange}
          className="combobox-search"
          options={[
            {
              value: "new",
              label: "Шинэ нь эхэндээ",
            },
            {
              value: "old",
              label: "Хуучин нь эхэндээ",
            },
            {
              value: "cheap",
              label: "Үнэ өсөхөөр",
            },
            {
              value: "expensive",
              label: "Үнэ буурахаар",
            },
          ]}
        ></Select>
      </div>
      <div className="product-filter-list">
        {querys &&
          querys.map((el) => (
            <button onClick={() => handleDelete(el.name, el.data)}>
              {el.name === "use"
                ? parseInt(el.data) === 100
                  ? "Шинэ"
                  : el.data + "%"
                : el.data}
              <FontAwesomeIcon icon={faX} />
            </button>
          ))}
      </div>
      <div className="row gy-4">
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
                        src={base.cdnUrl + "/350x350/" + product.pictures[0]}
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
                          {new Intl.NumberFormat().format(product.discount)}₮{" "}
                          <span>
                            {" "}
                            {new Intl.NumberFormat().format(
                              product.price
                            )}₮{" "}
                          </span>
                        </h4>
                      )}
                      {product.isDiscount == false && (
                        <h4 className="p-price">
                          {new Intl.NumberFormat().format(product.price)}₮
                        </h4>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
      {contentLoad === true && <BlockLoad />}
      {paginate && paginate.nextPage && (
        <div className="pagination">
          <button className="more-page" onClick={() => nextpage()}>
            Дараагийн хуудас
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
