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
  const { user } = useAuthContext();
  const { contentLoad } = useNotificationContext();

  useEffect(() => {
    if (!user) {
      redirect("/login");
    }
  }, [user]);

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
