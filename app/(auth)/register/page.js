"use client";
import React, { Button, Form, Input, InputNumber, Radio } from "antd";
import Link from "next/link";
import { useAuthContext } from "context/authContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useNotificationContext } from "context/notificationContext";
import GoogleAnalytics from "components/GoogleAnalytics";

export default function Page() {
  const { userRegister, isRedirect, setIsRedirect } = useAuthContext();
  const { contentLoad } = useNotificationContext();

  useEffect(() => {
    return () => {
      setIsRedirect(false);
    };
  }, []);

  useEffect(() => {
    if (isRedirect === true) redirect("/login");
  }, [isRedirect]);

  const onFinishFailed = (errorInfo) => {
    // toastControl("error", errorInfo);
  };

  const onFinish = async (values) => {
    await userRegister(values);
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
      ) : null}

      <section>
        <div className="container">
          <div className="login_page">
            <h4> Бүртгүүлэх </h4>
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
                  placeholder="Имэйлээ оруулна уу"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Хүйсээ сонгоно уу!",
                  },
                ]}
              >
                <Radio.Group name="radiogroup" defaultValue="female">
                  <Radio value="male">Эрэгтэй</Radio>
                  <Radio value="female">Эмэгтэй</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Тус талбарыг заавал бөглөнө үү",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  style={{ width: "100%", borderRadius: "2px" }}
                  size="large"
                  placeholder="Нууц үгээ оруулна уу"
                />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Тус талбарыг заавал бөглөнө үү",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Эхний оруулсан нууц үгтэй тохирохгүй байна!")
                      );
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  size="large"
                  style={{ width: "100%", borderRadius: "2px" }}
                  placeholder="Нууц үгээ давтан оруулна уу"
                />
              </Form.Item>
              <Form.Item className="login-btn-box">
                <Button
                  loading={contentLoad}
                  size="large"
                  htmlType="submit"
                  className="loginBtn"
                >
                  Бүртгүүлэх
                </Button>
              </Form.Item>
              <div className="login-page-register">
                Танд бүртгэл байгаа бол <Link href="/login"> энд дарна </Link>{" "}
                уу
              </div>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
