"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "antd";
import axios from "axios-base";
import Loader from "components/Generals/Loader";
import NotFound from "components/Generals/Notfound";
import PayModule from "components/Pay/payModule";
import { useNotificationContext } from "context/notificationContext";
import { usePayContext } from "context/payContext";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const { contentLoad, setAlert } = useNotificationContext();
  const { setVisible, createQpay, closeOrder } = usePayContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setVisible(false);
    const fetchData = async () => {
      const result = await axios.get(`/orders/user/${id}`);
      if (result && result.data) {
        setData(result.data.data);
      }
    };

    fetchData().catch((err) => console.log(err));
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    closeOrder(id);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePay = async () => {
    if (data) {
      const invoiceData = {
        sender_invoice_no: data.orderNumber,
        invoice_description: data.orderNumber + " дугаартай захиалгын төлбөр",
        amount: data.total,
      };

      await createQpay(invoiceData);
    } else {
      setAlert("Өгөгдөл олдсонгүй дахин оролдоно уу");
    }
  };

  if (data) {
    let type = "";
    const currentDate = new Date(new Date().toJSON().slice(0, 10));
    let createAt =
      data.createAt &&
      new Date(moment(data.createAt).utcOffset("+0800").format("YYYY-MM-DD"));

    if (data.paid === true) {
      type = "Захиалга амжилттай";
    } else if (data.status === false && data.paid === false) {
      type = "Захиалга цуцлагдсан";
    } else if (data.paid === false && createAt < currentDate) {
      type = "Захиалга хүчингүй болсон";
    } else if (data.paid === false && createAt >= currentDate) {
      type = "Төлбөр хүлээгдэж байна";
    } else if (data.paid === false) {
      type = "Төлбөр хүлээгдэж байна";
    }

    return (
      <>
        <div className="page_detials_header">
          <div className="page_header_left">
            <button
              className="page-back"
              onClick={() => router.push("/userprofile/orders")}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="page-header-title">
              <h2>Миний захиалгууд</h2>
            </div>
          </div>
        </div>
        <div className="pro-box">
          <div className="page_detials_header">
            <div className="page_header_left">
              <h5>Захиалгын мэдээлэл</h5>
            </div>
            <div className="page_header_right">
              <span>Төлбөр төлөх хугацаа</span>
              <p> {data.createAt && data.createAt.slice(0, 10)} </p>
            </div>
          </div>
          <div className="divider-dashed" role="separator"></div>
          <div className="order-bill-status">
            <h4>{type}</h4>
            <div className="alert alert-warning">
              Төлбөр төлөгдсөний дараа таны захиалга баталгаажихыг анхаарна уу!
              Дээрх хугацаанд төлбөрөө төлөөгүй тохиолдолд таны захиалга
              автоматаар цуцлагдана.
            </div>
          </div>
          {type === "Төлбөр хүлээгдэж байна" && (
            <div className="order-bill-btns">
              <button className="ctrl-btn pay-back-btn" onClick={showModal}>
                Захиалга цуцлах{" "}
              </button>
              <button
                className="ctrl-btn pay-bill-btn"
                onClick={() => {
                  setVisible(true);
                  handlePay();
                }}
              >
                {" "}
                Төлбөр төлөх{" "}
              </button>
            </div>
          )}
        </div>

        <div className="pro-box">
          <div className="page_detials_header">
            <div className="page_header_left col-flex">
              <span>Захиалгын дугаар</span>
              <h5> {data.orderNumber} </h5>
            </div>
            <div className="page_header_right">
              <span>Захиалга хийсэн огноо</span>
              <p>
                {" "}
                {data.createAt &&
                  moment(data.createAt)
                    .utcOffset("+0800")
                    .format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </div>
          </div>
          <div className="divider-dashed" role="separator"></div>
          <div className="order-bill-invoice">
            <li>
              Барааны дүн:
              <span>{new Intl.NumberFormat().format(data.total)}₮</span>
            </li>

            <li>
              Хүргэлт болон угсралтын төлбөр:
              <span>
                Хүргэлтийн төлөр: Угсралт болон хүргэлтийн төлбөрийг
                бүтээгдэхүүний овор хэмжээ хаягын байршлаас хамааран бодож
                тухайн үед төлнө.
              </span>
            </li>
          </div>
        </div>
        <div className="pro-box">
          <div className="page_detials_header">
            <div className="page_header_left col-flex">
              <h5> Барааны мэдээллүүд</h5>
            </div>
          </div>
          <div className="divider-dashed" role="separator"></div>
          <div className="product-bill-list">
            {data.carts &&
              data.carts.map((cart) => (
                <div className="product-bill-item">
                  <div className="product-bill-left">
                    <div className="product-bill-picture">
                      <img src={cart.picture} />
                    </div>
                    <div className="product-bill-dtls">
                      <span>
                        {cart.type === "tire" && "Дугуй"}
                        {cart.type === "wheel" && "Обуд"}
                        {cart.type === "setProduct" && "Дугуй, Обуд"}
                        {cart.type === "product" && "Сэлбэг"} {cart.code}
                      </span>
                      <h6> {cart.name}</h6>
                      {cart.type !== "product" ? (
                        <span className="qty">Тоо ширхэг: {cart.total}</span>
                      ) : (
                        <span className="qty"> Үлдэгдэл: {cart.total}</span>
                      )}
                    </div>
                  </div>
                  <div className="product-bill-right">
                    {cart.type !== "product" && cart.isDiscount === false ? (
                      <h5>{new Intl.NumberFormat().format(cart.price)}₮</h5>
                    ) : (
                      cart.type !== "product" && (
                        <>
                          <span className="cart-discount">
                            {new Intl.NumberFormat().format(cart.price)}₮
                          </span>
                          <h5>
                            {new Intl.NumberFormat().format(cart.discount)}₮
                          </h5>
                        </>
                      )
                    )}

                    {cart.type == "product" && cart.isDiscount === false ? (
                      <h5>
                        {cart.qty} *{" "}
                        {new Intl.NumberFormat().format(cart.price * cart.qty)}₮
                      </h5>
                    ) : (
                      cart.type == "product" && (
                        <>
                          <span className="cart-discount">
                            {cart.qty} *{" "}
                            {new Intl.NumberFormat().format(
                              cart.price * cart.qty
                            )}
                            ₮
                          </span>
                          <h5>
                            {cart.qty} *{" "}
                            {new Intl.NumberFormat().format(
                              cart.discount * cart.qty
                            )}
                            ₮
                          </h5>
                        </>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="pro-box">
          <div className="page_detials_header">
            <div className="page_header_left col-flex">
              <h5> Захиалагчийн мэдээлэл</h5>
            </div>
          </div>
          <div className="divider-dashed" role="separator"></div>
          <div className="bill-contacts row">
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="bill-contact-item">
                <span>Овог</span>
                <p>{data.lastName}</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="bill-contact-item">
                <span>Нэр</span>
                <p>{data.firstName}</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="bill-contact-item">
                <span>Утас</span>
                <p>{data.phoneNumber}</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="bill-contact-item">
                <span>Цахим хаяг</span>
                <p>{data.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pro-box">
          <div className="page_detials_header">
            <div className="page_header_left col-flex">
              <h5> Захиалагчийн мэдээлэл</h5>
            </div>
          </div>
          <div className="divider-dashed" role="separator"></div>
          <p className="bill-address">{data.address}</p>
        </div>
        <PayModule invoice={data} />
        <Modal
          title="Захиалга устгах"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={() => handleCancel()}>
              Буцах
            </Button>,
            <Button
              loading={contentLoad}
              type="primary"
              onClick={() => handleOk()}
            >
              Тийм{" "}
            </Button>,
          ]}
        >
          <p>Захиалгын устгахдаа итгэлтэй байна уу</p>
        </Modal>
      </>
    );
  }
}
