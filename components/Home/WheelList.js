"use client";
import base from "lib/base";
import { getWheels } from "lib/wheel";
import Link from "next/link";
import { useEffect, useState } from "react";

const WheelList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { wheels } = await getWheels(`status=true&limit=12`);
      setData(wheels);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  return (
    <>
      <section>
        <div className="container">
          <div className="seaction-header">
            <h4> Шинээр нэмэгдсэн обудууд </h4>
          </div>
          <div className="product-list">
            <div className="row gy-4">
              {data &&
                data.map((wheel) => (
                  <div
                    className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6"
                    key={wheel._id}
                  >
                    <Link href={`/wheels/${wheel._id}`}>
                      <div className="product-item">
                        <div className="product-item-img">
                          <div className="product-item-set">
                            Ширхэг: {wheel.setOf}
                          </div>
                          {wheel.pictures && wheel.pictures[0] ? (
                            <img
                              src={
                                base.cdnUrl + "/350x350/" + wheel.pictures[0]
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
                            <li>Болт: {wheel.boltPattern}</li>
                          </div>
                          <div className="product-item-price">
                            {wheel.isDiscount == true && (
                              <h4 className="p-discount">
                                {new Intl.NumberFormat().format(wheel.discount)}
                                ₮{" "}
                                <span>
                                  {" "}
                                  {new Intl.NumberFormat().format(
                                    wheel.price
                                  )}₮{" "}
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
          </div>
          <Link href="/wheels" className="more-btn">
            Бүх обудыг үзэх
          </Link>
        </div>
      </section>
    </>
  );
};

export default WheelList;
