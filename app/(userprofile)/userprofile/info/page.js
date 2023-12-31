"use client";
import { Button, Form, Input, InputNumber, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useAuthContext } from "context/authContext";
import { toastControl } from "lib/toastControl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["gotiretoken"]);
  const {
    user,
    getUser,
    userInfoChange,
    isChange,
    clear,
    notification,
    error,
  } = useAuthContext();

  const [form] = Form.useForm();
  const router = useRouter();

  const changeData = () => {
    form.validateFields().then((values) => {
      userInfoChange(values);
    });
  };

  useEffect(() => {
    getUser(cookies.gotiretoken);
  }, []);

  useEffect(() => {
    if (isChange === true) {
      toastControl("success", "Амжилттай мэдээлэл солигдлоо");
      clear();
    }
  }, [isChange]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user });
    }
  }, [user]);

  useEffect(() => {
    toastControl("error", error);
  }, [error]);

  useEffect(() => {
    if (notification != null) {
      toastControl("success", notification);
    }
  }, [notification]);

  return (
    <>
      <div className="profile-box">
        <h4> Хувийн мэдээлэл </h4>
        <div className="pro-box profile-card">
          <div className="profile-card-header">
            <h6> Хувийн мэдээлэл </h6>
            <span>Сүүлд өөрчлөлт хийгдсэн {user && user.updateAt} </span>
          </div>
          <div className="divider-dot"> </div>
          <Form
            name="basic"
            className="user-edit-form"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
            form={form}
          >
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Овог нэрээ оруулна уу!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ width: "100%", borderRadius: "2px" }}
                    placeholder="Та овог нэрээ оруулна уу"
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Нэрээ оруулна уу!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ width: "100%", borderRadius: "2px" }}
                    placeholder="Та нэрээ оруулна уу"
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Утасны дугаараа оруулна уу!",
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "100%", borderRadius: "2px" }}
                    placeholder="Утасны дугаараа оруулна уу"
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Имэйлээ оруулна уу!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    style={{ width: "100%", borderRadius: "2px" }}
                    placeholder="Та Имэйлээ оруулна уу"
                  />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item
                  label="Хүргүүлэх хаягаа оруулна уу"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Хаягаа оруулна уу!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </div>
            </div>
          </Form>
          <div className="profile-card-footer">
            <button onClick={() => router.back()} className="back-btn">
              Буцах
            </button>
            <button className="change-btn" size="large" onClick={changeData}>
              Мэдээлэл шинэчлэх
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
