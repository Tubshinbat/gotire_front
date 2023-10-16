"use client";

import base from "lib/base";

const { useCartContext } = require("context/cartContext");
const { useMenuContext } = require("context/menuContext");
const { useWebInfoContext } = require("context/webinfoContext");
import { useAuthContext } from "context/authContext";
const { useEffect, useState, use } = require("react");

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import MobileMenu from "components/Generals/MobileMenu";
import Aos from "aos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Header = () => {
  const { info, getInfo } = useWebInfoContext();
  const { menus } = useMenuContext();
  const { user } = useAuthContext();
  const { cart } = useCartContext();
  const router = useRouter();
  const [searchData, setSearchData] = useState({});
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      let header = document.querySelector(".top-header");
      let headerSearch = document.querySelector(".header-search");
      let pageDetailsHeader = document.querySelector(".pageDetailsHeader");
      let pageSide = document.querySelector(".page_sides");
      let productSide = document.querySelector(".product-side");
      if (header) {
        let sticky = header.offsetHeight;
        // if (headerSearch) {
        //   sticky = headerSearch.offsetHeight;
        // }
        // if (pageDetailsHeader) {
        //   sticky = pageDetailsHeader.offsetHeight;
        // }
        if (window.pageYOffset > sticky) {
          header.classList.add(`headerSticky`);
          if (pageSide) {
            pageSide.classList.add("side-margin-top");
          }
          if (productSide) {
            productSide.classList.add("side-margin-top");
          }
        } else {
          header.classList.remove(`headerSticky`);
          if (pageSide) {
            pageSide.classList.remove("side-margin-top");
          }
          if (productSide) {
            productSide.classList.remove("side-margin-top");
          }
        }
      }
    }
    getInfo();
    Aos.init();

    window.addEventListener("scroll", onScroll);
  }, []);

  const handleChange = (e) => {
    setSearchData((bs) => ({ ...bs, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    switch (searchData.type) {
      case "Дугуй":
        router.push(`/tires?name=${searchData.search}`);
        break;
      case "Обуд":
        router.push(`/wheels?name=${searchData.search}`);
        break;
      case "Дугуй, обуд":
        router.push(`/setproducts?name=${searchData.search}`);
        break;
      case "Сэлбэгүүд":
        router.push(`/products?name=${searchData.search}`);
        break;
      default:
        router.push(`/search?name=${searchData.search}`);
        break;
    }
  };

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) setSearchData((bs) => ({ ...bs, name }));
    else setSearchData((bs) => ({ ...bs, name: "" }));
  }, [searchParams]);

  return (
    <>
      <div className="top-header">
        <div className="custom-container">
          <div className="header">
            <div className="header-left">
              <div className="header-logo">
                {info.logo && (
                  <a href="/">
                    <img
                      src={`${base.cdnUrl}/${info.whiteLogo}`}
                      className="whiteLogo"
                    />
                  </a>
                )}
              </div>
              <div className="search-main">
                <select
                  className="search-select"
                  name="type"
                  onChange={handleChange}
                >
                  <option> Бүгд </option>
                  <option selected={pathname === "/tires"}> Дугуй </option>
                  <option selected={pathname === "/wheels"}> Обуд </option>
                  <option selected={pathname === "/setproducts"}>
                    Дугуй, обуд
                  </option>
                  <option selected={pathname === "/products"}>
                    Сэлбэгүүд{" "}
                  </option>
                </select>
                <input
                  className="search-input"
                  name="search"
                  placeholder="Хайлт хийхдээ 195/65/15, Хол 5-14 г.м"
                  onChange={handleChange}
                  defaultValue={searchData.name !== null && searchData.name}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
            <div className="header-right">
              <div className="auth-btns">
                {!user && (
                  <>
                    <Link href="/login" className="header-login-btn">
                      Нэвтрэх
                    </Link>
                    <Link href="/register" className="header-register-btn">
                      Бүртгүүлэх
                    </Link>
                  </>
                )}
                {user && (
                  <Link href="/userprofile" className="header-register-btn">
                    {user.firstName}
                  </Link>
                )}
              </div>
              <div
                className="header-mobile-search"
                onClick={() => router.push("/search")}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <div className="header-cart" onClick={() => router.push("/cart")}>
                <img src="/images/shopping-cart.png" />
                <span>{cart.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="top-menu">
          <div className="custom-container">
            <ul className="headerMenu">{menus}</ul>
            <MobileMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
