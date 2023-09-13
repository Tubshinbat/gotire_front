"use client";
import HomeHeader from "components/Generals/Header";
import Loader from "components/Generals/Loader";
import Side from "components/Users/Side";
import { useAuthContext } from "context/authContext";
import { useNotificationContext } from "context/notificationContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function RootLayout({ children }) {
  const { user, checkUser } = useAuthContext();
  const { contentLoad, setContentLoad } = useNotificationContext();

  useEffect(() => {
    setContentLoad(true);
    const check = async () => {
      const result = await checkUser();
      if (result == false) {
        window.location.replace("/login");
      }
      setContentLoad(false);
    };

    check().catch((error) => {});
  }, []);

  if (contentLoad == true) {
    return (
      <>
        <section className="pd-4">
          <div className="custom-container">
            <div className="row">
              <Loader />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="pd-4">
        <div className="custom-container">
          <div className="row">
            <div className="col-md-3">
              <Side />
            </div>
            <div className="col-md-9">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
