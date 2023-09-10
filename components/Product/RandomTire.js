"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { getRandomTires } from "lib/tire";
import { useEffect, useState } from "react";
import { Pagination, Navigation, Autoplay } from "swiper";

import "styles/banner.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import Link from "next/link";
import base from "lib/base";

const RandomTire = () => {
  const [tires, setTires] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRandomTires();
      setTires(result);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  return (
    <>
      <section>
        <div className="container">
          <div className="suggest-header">
            <h4> Санал болгох дугуйнууд</h4>
          </div>

          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            autoplay={{
              delay: 3000,
            }}
            loop="true"
            simulateTouch="false"
            slidesPerView={6}
            spaceBetween={40}
            navigation={{
              prevEl: ".slide__prev",
              nextEl: ".slide__next",
            }}
            className="tires-slider"
            breakpoints={{
              1000: {
                slidesPerView: 6,
              },
              800: {
                slidesPerView: 4,
              },

              100: {
                slidesPerView: 2,
              },
            }}
          >
            {tires &&
              tires.map((tire) => (
                <SwiperSlide key={tire._id} className="tire_slide">
                  <Link href={`/tires/${tire._id}`}>
                    <div className="product-item">
                      <div className="product-item-img">
                        <div className="product-item-set">
                          Ширхэг: {tire.setOf}
                        </div>
                        {tire.pictures && tire.pictures[0] ? (
                          <img
                            src={base.cdnUrl + "/350x350/" + tire.pictures[0]}
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
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            <div className="slide__nav newsViewSlide__nav">
              <div className="slide__prev swiper-button-prev"></div>
              <div className="slide__next swiper-button-next"></div>
            </div>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default RandomTire;
