"use client";

import base from "lib/base";
import Link from "next/link";
import { Select } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useNotificationContext } from "context/notificationContext";
import BlockLoad from "components/Generals/BlockLoad";
import { useEffect } from "react";
import { useSearchWheelContext } from "context/searchWheelContext";
import { getWheels } from "lib/wheel";

const WheelList = () => {
  const {
    wheels,
    paginate,
    createQueryString,
    removeQuery,
    querys,
    buildQuerys,
    setWheels,
    setPaginate,
    rimData,
  } = useSearchWheelContext();

  const { contentLoad, setContentLoad } = useNotificationContext();
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    if (rimData) {
      const params = createQueryString("rim", rimData);
      router.push(pathname + "?" + params);
    }
  }, [rimData]);

  const handleChange = (value) => {
    queryBuild("sort", value);
  };

  const handleDelete = (name, data) => {
    const params = removeQuery(name, data);
    router.push(pathname + "?" + params);
  };

  const nextpage = () => {
    const qry = buildQuerys();
    const next = async () => {
      const { wheels, pagination } = await getWheels(
        `${qry}page=${paginate.nextPage}`
      );

      setWheels((bs) => [...bs, ...wheels]);
      setPaginate(() => ({ ...pagination }));
    };

    if (paginate && paginate.nextPage) {
      next().catch((error) => console.log(error));
    }
  };

  return (
    <div className="product-main">
      <div className="product-main-header">
        <h4>
          Обуд <span> | нийт {(paginate && paginate.total) || 0} </span>{" "}
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
        {wheels &&
          wheels.map((wheel) => (
            <div className="col-lg-2 col-md-3 col-sm-6 col-6">
              <Link href={`/wheels/${wheel.slug}`}>
                <div className="product-item">
                  <div className="product-item-img">
                    <div className="product-item-set">
                      Ширхэг: {wheel.setOf}
                    </div>
                    {wheel.pictures && wheel.pictures[0] ? (
                      <img
                        src={base.cdnUrl + "/350x350/" + wheel.pictures[0]}
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
                          {new Intl.NumberFormat().format(wheel.discount)}₮{" "}
                          <span>
                            {" "}
                            {new Intl.NumberFormat().format(wheel.price)}₮{" "}
                          </span>
                        </h4>
                      )}
                      {wheel.isDiscount == false && (
                        <h4 className="p-price">
                          {new Intl.NumberFormat().format(wheel.price)}₮
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

export default WheelList;
