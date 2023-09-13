"use client";
import HomeHeader from "components/Generals/Header";
import Loader from "components/Generals/Loader";
import Side from "components/Users/Side";
import { useAuthContext } from "context/authContext";
import { useNotificationContext } from "context/notificationContext";
import { useEffect } from "react";

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

  return (
    <>
      <section className="pd-4">
        <div className="custom-container">
          <div className="row">
            <div className="col-md-3">
              <Side />
            </div>
            <div className="col-md-9">
              {contentLoad === true ? <Loader /> : children}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
