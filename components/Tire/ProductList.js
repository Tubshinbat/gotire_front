"use client";
import { useSearchContext } from "context/searchContext";
import base from "lib/base";
import Link from "next/link";
import { Select } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useNotificationContext } from "context/notificationContext";
import BlockLoad from "components/Generals/BlockLoad";
import { getTires } from "lib/tire";
import { useEffect } from "react";

const ProductList = () => {
  const {
    tires,
    paginate,
    createQueryString,
    removeQuery,
    querys,
    buildQuerys,
    setTires,
    setPaginate,
    wheelsize,
  } = useSearchContext();
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

  useEffect(() => {
    if (wheelsize) {
      const params = createQueryString("tiresize", wheelsize);
      router.push(pathname + "?" + params);
    }
  }, [wheelsize]);

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) queryBuild("name", name);
  }, [searchParams]);

  const handleChange = (value) => {
    queryBuild("sort", value);
  };

  const nextpage = () => {
    const qry = buildQuerys();

    const next = async () => {
      const { tires, pagination } = await getTires(
        `${qry}page=${paginate.nextPage}`
      );
      setTires((bs) => [...bs, ...tires]);
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
          Дугуй <span> | нийт {(paginate && paginate.total) || 0} </span>{" "}
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
                : el.name === "season"
                ? (el.data === "winter" && "Өвлийн") ||
                  (el.data === "summer" && "Зуны") ||
                  (el.data === "allin" && "Дөрвөн улиралын")
                : el.data}
              <FontAwesomeIcon icon={faX} />
            </button>
          ))}
      </div>
      <div className="row gy-4">
        {tires &&
          tires.map((tire) => (
            <div className="col-lg-2 col-md-3 col-sm-6 col-6">
              <Link href={`/tires/${tire._id}`}>
                <div className="product-item">
                  <div className="product-item-img">
                    <div className="product-item-set">Ширхэг: {tire.setOf}</div>
                    {tire.pictures && tire.pictures[0] ? (
                      <img src={base.cdnUrl + "/350x350/" + tire.pictures[0]} />
                    ) : (
                      <img src="/images/no-product.jpg" />
                    )}
                  </div>
                  <div className="product-item-dtl">
                    <h4>{tire.name}</h4>
                    <div className="product-item-infos">
                      <li>
                        Хэмжээ:{" "}
                        {tire.width + "/" + tire.height + "R" + tire.diameter}
                      </li>
                      <li>Үйлдвэрлэгч: {tire.make.name}</li>
                    </div>
                    <div className="product-item-price">
                      {tire.isDiscount == true && (
                        <h4 className="p-discount">
                          {new Intl.NumberFormat().format(tire.discount)}₮{" "}
                          <span>
                            {" "}
                            {new Intl.NumberFormat().format(tire.price)}₮{" "}
                          </span>
                        </h4>
                      )}
                      {tire.isDiscount == false && (
                        <h4 className="p-price">
                          {new Intl.NumberFormat().format(tire.price)}₮
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
