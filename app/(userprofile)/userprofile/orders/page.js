"use client";

import axios from "axios-base";
import Loader from "components/Generals/Loader";
import { useNotificationContext } from "context/notificationContext";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [paginate, setPaginate] = useState(null);
  const { setError, contentLoad } = useNotificationContext();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/orders/user");

      if (result) {
        setData(result.data.data);
        setPaginate(result.data.pagination);
      }
    };
    fetchData().catch((err) => setError(err));
  }, []);

  const nextpage = () => {
    const next = async () => {
      const result = await axios.get(`orders/user?page=${paginate.nextPage}`);

      if (result) {
        setData((bs) => [...bs, ...result.data.data]);
        setPaginate(result.data.pagination);
      }
    };

    if (paginate && paginate.nextPage) {
      next().catch((error) => console.log(error));
    }
  };

  return (
    <>
      <h6 className="section-title">
        Захиалгууд: {paginate && paginate.total}{" "}
      </h6>

      <div className="order-list">
        {contentLoad === true && <Loader />}
        {data &&
          data.length > 0 &&
          data.map((el) => {
            let type = "";
            const currentDate = new Date().toJSON().slice(0, 10);
            let createAt =
              el.createAt &&
              moment(el.createAt).utcOffset("+0800").format("YYYY-MM-DD");

            if (el.paid === true) {
              type = "Захиалга амжилттай";
            } else if (el.status === false && el.paid === false) {
              type = "Захиалга цуцлагдсан";
            } else if (el.paid === false && createAt < currentDate) {
              type = "Захиалга хүчингүй болсон";
            } else if (el.paid === false && createAt >= currentDate) {
              type = "Төлбөр хүлээгдэж байна";
            } else if (el.paid === false) {
              type = "Төлбөр хүлээгдэж байна";
            }

            return (
              <Link href={`/userprofile/orders/${el._id}`}>
                <div className="order-item">
                  <div className="order-left">
                    <div className="order-code">
                      <span>Захиалгын дугаар </span>
                      <h6> {el.orderNumber} </h6>
                    </div>
                    <div className="order-status">
                      <span>
                        {moment(el.createAt)
                          .utcOffset("+0800")
                          .format("YYYY-MM-DD HH:mm:ss")}{" "}
                      </span>
                      <h6> {type} </h6>
                    </div>
                  </div>
                  <div className="order-right">
                    <div className="order-products">
                      {el.carts &&
                        el.carts.map(
                          (cart) => cart.name + " x " + cart.qty + ", "
                        )}
                    </div>
                    <div className="order-price">
                      <span>Дүн</span>
                      <p> {new Intl.NumberFormat().format(el.total)}₮</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        {paginate && paginate.nextPage && (
          <div className="pagination">
            <button className="more-page" onClick={() => nextpage()}>
              Дараагийн хуудас
            </button>
          </div>
        )}
      </div>
    </>
  );
}
