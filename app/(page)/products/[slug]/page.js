"use client";
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "components/Generals/Loader";
import NotFound from "components/Generals/Notfound";
import GoogleAnalytics from "components/GoogleAnalytics";
import RandomTire from "components/Product/RandomTire";
import { useCartContext } from "context/cartContext";
import base from "lib/base";
import { getProduct } from "lib/product";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";

export default function Page({ params: { slug } }) {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { cartAdd } = useCartContext();

  const handleCart = () => {
    if (product) {
      const cartData = {
        productInfo: product._id,
        type: "product",
        code: product.productCode,
        name: product.name,
        qty: parseInt(qty),
        total: product.setOf,
        isDiscount: product.isDiscount,
        price: product.price,
        discount: product.discount,
        picture:
          product.pictures && product.pictures[0]
            ? base.cdnUrl + "/150x150/" + product.pictures[0]
            : "/images/no-product.jpg",
      };
      cartAdd(cartData);
    }
  };

  const handleShop = () => {
    if (product) {
      const cartData = {
        productInfo: product._id,
        type: "product",
        code: product.productCode,
        name: product.name,
        qty: parseInt(qty),
        total: product.setOf,
        isDiscount: product.isDiscount,
        price: product.price,
        discount: product.discount,
        picture:
          product.pictures && product.pictures[0]
            ? base.cdnUrl + "/150x150/" + product.pictures[0]
            : "/images/no-product.jpg",
      };
      cartAdd(cartData);
      router.push("/cart");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      const { product } = await getProduct(slug);

      setProduct(product);
      setLoading(false);
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (product) {
      let img = [];
      product.pictures.map((picture) =>
        img.push({
          original: base.cdnUrl + "/" + picture,
          thumbnail: base.cdnUrl + "/150x150/" + picture,
        })
      );

      setImage(img);
    }
  }, [product]);

  if (loading === true) {
    return (
      <>
        <section>
          <div className="container">
            <Loader />
          </div>
        </section>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <section>
          <NotFound />
        </section>
      </>
    );
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="page_detials_header">
                <div className="page_header_left">
                  <button className="page-back" onClick={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                  <div className="page-header-title">
                    <h2>{product.name}</h2>
                    <span>#{product.productCode}</span>
                  </div>
                </div>
              </div>
              <ImageGallery items={image} />
            </div>
            <div className="col-lg-4">
              <div className="product-side sticky-top">
                {product.isDiscount === false && (
                  <div className="price-box">
                    <span> Үндсэн үнэ: </span>
                    <h4> {new Intl.NumberFormat().format(product.price)}₮ </h4>
                  </div>
                )}
                {product.isDiscount === true && (
                  <div className="discount-box">
                    <div className="discount-price">
                      <span> Хямдралтай үнэ: </span>
                      <h4>
                        {new Intl.NumberFormat().format(product.discount)}₮{" "}
                      </h4>
                    </div>
                    <div className="init-price">
                      <span> Анхны үнэ: </span>
                      <h4>{new Intl.NumberFormat().format(product.price)}₮ </h4>
                    </div>
                  </div>
                )}
                <div className="divider-dashed" role="separator"></div>
                <div className="qty-box">
                  <span> Тоо ширхэг</span>
                  <div className="qty-controls">
                    <button
                      className="qty-control"
                      onClick={() => {
                        qty - 1 > 0 && setQty((bq) => bq - 1);
                      }}
                    >
                      -
                    </button>
                    <p> {qty} </p>
                    <button
                      className="qty-control"
                      onClick={() => {
                        qty + 1 <= product.setOf && setQty((bq) => bq + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="setof-count">
                    {product.setOf} ширхэг бэлэн байна
                  </span>
                </div>

                <div className="product-shop-btns">
                  <button className="cart-btn" onClick={() => handleCart()}>
                    Сагсанд нэмэх
                  </button>
                  <button className="shop-btn" onClick={() => handleShop()}>
                    Худалдан авах
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="product-more">
                <h5> Дэлгэрэнгүй мэдээлэл</h5>

                <div
                  className={`product-detials`}
                  dangerouslySetInnerHTML={{
                    __html: product.details,
                  }}
                ></div>
              </div>
              <RandomTire />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
