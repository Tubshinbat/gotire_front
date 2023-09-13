"use client";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getBanks } from "lib/payment";
import { toastControl } from "lib/toastControl";

import { useEffect } from "react";
import { useState } from "react";

import { usePayContext } from "context/payContext";
import { useNotificationContext } from "context/notificationContext";
import { useRouter } from "next/navigation";
import { Modal } from "antd";

const PayModule = (props) => {
  const { visible, setVisible, checkPayment, isPaid, invoice } =
    usePayContext();

  const { contentLoad, setContentLoad } = useNotificationContext();
  const [banks, setBanks] = useState([]);
  const [acitveTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(contentLoad);
  const router = useRouter();
  useEffect(() => {
    setLoading(contentLoad);
  }, [contentLoad]);

  useEffect(() => {
    const fetchData = async () => {
      setContentLoad(true);
      const { banks } = await getBanks();
      setBanks(banks);
    };
    fetchData().catch((error) => console.log(error));
    setContentLoad(false);
  }, []);

  const paymentCheck = async () => {
    setLoading(true);
    const result = await checkPayment(invoice.sender_invoice_no);
    if (result === true) {
      router.push("/userprofile/orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (invoice) {
      setTimeout(async () => {
        const result = await checkPayment(invoice.sender_invoice_no);
        if (result == true) {
          router.push("/userprofile/orders");
        }
      }, 1000 * 15);
    }
  }, [invoice]);

  useEffect(() => {
    if (isPaid == true) {
      toastControl("success", "Гүйлгээ амжилттай хийгдлээ");
      setLoading(false);
    }
  }, [isPaid]);

  return (
    <>
      <Modal
        open={visible}
        title="Дансаар эсвэл Qpay ашиглах"
        width={1000}
        footer={[]}
        onCancel={() => setVisible(false)}
      >
        <div tabindex="0" aria-hidden="true"></div>
        <div className="payModal-content">
          <div className="payModal-body">
            <div className="modal-body">
              {loading === true && (
                <div className="loader-box">
                  <div class="loader">Loading...</div>
                </div>
              )}
              <div className="modal-header">
                <div className="left-section">
                  <div className="modal-title">
                    <h3> Дансаар эсвэл Qpay ашиглах </h3>
                    <div className="modal-sub-title">
                      Аль ч банкны аппликейшн ашиглан уншуулж болно.
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-content">
                <div className="qpay">
                  <h5>QR код уншуулах</h5>
                  {invoice && (
                    <img src={`data:image/png;base64,${invoice.qr_image}`} />
                  )}
                  <button className="qpay-btn" onClick={() => paymentCheck()}>
                    Төлбөр шалгах{" "}
                  </button>
                </div>
                <div className="banks">
                  <h5>Дансаар шилжүүлэх</h5>
                  <div className="banks-header">
                    {banks &&
                      banks.map((bank, index) => (
                        <div
                          className={`tab-choise ${
                            acitveTab === index && "active"
                          }`}
                          onClick={() => setActiveTab(index)}
                        >
                          {bank.bankName}
                        </div>
                      ))}
                  </div>
                  <div className="bank-invoice">
                    <div className="item">
                      <div className="sub"> Хүлээн авах данс</div>
                      <div className="typography">
                        <span>
                          {banks &&
                            banks[acitveTab] &&
                            banks[acitveTab].bankAccount}
                        </span>
                        <button
                          onClick={() => {
                            toastControl("success", "Хуулагдлаа");
                            navigator.clipboard.writeText(
                              banks &&
                                banks[acitveTab] &&
                                banks[acitveTab].bankAccount
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </div>
                    </div>
                    <div className="item">
                      <div className="sub"> Хүлээн авагч</div>
                      <div className="typography">
                        <span>
                          {banks &&
                            banks[acitveTab] &&
                            banks[acitveTab].accountName}{" "}
                        </span>
                        <button
                          onClick={() => {
                            toastControl("success", "Хуулагдлаа");
                            navigator.clipboard.writeText(
                              banks &&
                                banks[acitveTab] &&
                                banks[acitveTab].accountName
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </div>
                    </div>
                    <div className="item">
                      <div className="sub"> Төлөх дүн</div>
                      <div className="typography">
                        <span>
                          {props.invoice &&
                            new Intl.NumberFormat().format(props.invoice.total)}
                          ₮
                        </span>
                        <button
                          onClick={() => {
                            toastControl("success", "Хуулагдлаа");
                            navigator.clipboard.writeText(
                              props.invoice && props.invoice.total
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </div>
                    </div>
                    <div className="item">
                      <div className="sub"> Гүйлгээний утга</div>
                      <div className="typography">
                        <span>
                          {props.invoice && props.invoice.orderNumber}
                        </span>
                        <button
                          onClick={() => {
                            toastControl("success", "Хуулагдлаа");
                            navigator.clipboard.writeText(
                              props.invoice && props.invoice.orderNumber
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="alert alert-warning qpay-info">
                Банкны дансаар шилжүүлсэн бол ажлын өдрүүдэд шалган
                баталгаажуулах болно <br />
                <br /> <strong> Qpay - ээр </strong>Төлбөрөө төлсөн бол "ТӨЛБӨР
                ШАЛГАХ" товч дээр дарна уу. Жич: Төлсөн ч төлөөгүй гэсэн хариу
                өгч байвал дахин шалгаарай.
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PayModule;
