"use client";

import React, {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
} from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuthContext } from "context/authContext";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { toastControl } from "lib/toastControl";
import { useCookies } from "react-cookie";
import { redirect } from "next/navigation";
import { useNotificationContext } from "context/notificationContext";
import GoogleAnalytics from "components/GoogleAnalytics";

export default function Page() {
  const { loginUser, user } = useAuthContext();
  const { contentLoad } = useNotificationContext();

  const onFinishFailed = (errorInfo) => {};

  const onFinish = async (values) => {
    await loginUser(values);
  };

  useEffect(() => {
    if (user) {
      redirect("/userprofile");
    }
  }, []);

  useEffect(() => {
    if (user) {
      redirect("/userprofile");
    }
  }, [user]);

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}
     
      <section>
        <div className="container">
          <div className="login_page">
            <h4> Нэвтрэх </h4>
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Та өөрийн бүртгэлтэй утасны дугаараа оруулна уу!",
                  },
                ]}
                className="loginInput"
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%", borderRadius: "2px" }}
                  placeholder="Та утасны дугаараа оруулна уу"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу",
                  },
                ]}
                className="loginInput"
              >
                <Input.Password
                  size="large"
                  placeholder="Нууц үгээ оруулна уу"
                  prefix={<KeyOutlined />}
                />
              </Form.Item>
              <Form.Item className="login-btn-box">
                <Button
                  size="large"
                  loading={contentLoad}
                  htmlType="submit"
                  className="loginBtn"
                >
                  Нэвтрэх
                </Button>
              </Form.Item>
              <div className="login-page-register">
                Нууц үгээ мартсан бол <Link href="/forget"> энд дарна </Link> уу
              </div>
              <Form.Item>
                <Link href="/register">
                  <Button
                    size="large"
                    htmlType="button"
                    className="registerBtn"
                  >
                    Бүртгүүлэх
                  </Button>
                </Link>
              </Form.Item>
            </Form>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </section>
    </>
  );
}
