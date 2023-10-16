"use client";
import base from "lib/base";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWebInfoContext } from "context/webinfoContext";
import { useMenuContext } from "context/menuContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const MobileMenu = () => {
  const { info, getInfo } = useWebInfoContext();
  const { menus, getMenu } = useMenuContext();

  useEffect(() => {
    return () => setActive(false);
  });

  const [active, setActive] = useState(false);

  const backGo = () => {
    router.back();
  };

  const handleToggle = () => {
    setActive((ba) => {
      if (ba === true) return false;
      else return true;
    });
  };

  return (
    <>
      <div className="m-menu">
        <div className="burger__menu" onClick={handleToggle}>
          <span className="line"> </span>
          <span className="line"> </span>
          <span className="line"> </span>
        </div>
      </div>
      <div
        className={`menuMobile  ${
          active === true ? "displayBlock" : "displayNone"
        }`}
      >
        <h5>
          <FontAwesomeIcon icon={faClose} onClick={handleToggle} /> Үндсэн цэс
        </h5>
        <ul>{menus}</ul>
        <div className="contactMobile">
          <li>
            <a href={`tel:${info.phone}`}> Утас: {info.phone} </a>
          </li>
          <li>
            <a href={`mailto:${info.email}`}> Имэйл: {info.email} </a>
          </li>
          <li>Хаяг: {info.address}</li>
        </div>
        {/* <div className="socialMobile">
          {socialLinks &&
            socialLinks.map((el) => (
              <a href={el.link} key={`${el._id}-som`} target="_blank">
                <i
                  className={`fa-brands fa-${el.name.toLowerCase()}-square`}
                ></i>
              </a>
            ))}
        </div> */}
      </div>
      <div
        className={`menuMobile-bg ${
          active === true ? "displayBlock" : "displayNone"
        }`}
        onClick={handleToggle}
      ></div>
    </>
  );
};

export default MobileMenu;
