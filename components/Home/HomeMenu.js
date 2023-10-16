"use client";
import { useSideSearchContext } from "context/sideSearchContext";
// import SideSearch from "components/Generals/SideSearch";
import base from "lib/base";
import { getProductCategories } from "lib/setProduct";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HomeMenu = () => {
  const [menus, setMenus] = useState([]);
  const { handleToggle, setVisible } = useSideSearchContext();
  const router = useRouter();

  useEffect(() => {
    const fetchDatas = async () => {
      const { categories } = await getProductCategories();
      setMenus(categories);
    };
    fetchDatas().catch((err) => console.log(err));
    return () => {
      setVisible(false);
    };
  }, []);

  const handleSearch = (name) => {
    handleToggle(name);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="seaction-header">
            <h4>Ангилал</h4>
          </div>
          <div className="row category-list gy-4">
            <div className="col-xl-2 col-lg-3 col-md-3 col-md-4 col-sm-4 col-6">
              <button
                className="single-category"
                onClick={() => handleSearch("tire")}
              >
                <div className="single-category-img">
                  <img src="/images/tire_category.png" />
                </div>
                <h4 className="single-category-name"> Дугуй </h4>
              </button>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-3 col-md-4 col-sm-4 col-6">
              <button
                className="single-category"
                onClick={() => handleSearch("wheel")}
              >
                <div className="single-category-img">
                  <img src="/images/wheel_category.png" />
                </div>
                <h4 className="single-category-name"> Обуд </h4>
              </button>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-3 col-md-4 col-sm-4 col-6">
              <button
                className="single-category"
                onClick={() => handleSearch("setproduct")}
              >
                <div className="single-category-img">
                  <img src="/images/set_category.png" />
                </div>
                <h4 className="single-category-name"> Дугуй, Обуд </h4>
              </button>
            </div>
            {menus &&
              menus.map((cat) => (
                <div
                  className="col-xl-2 col-lg-3 col-md-3 col-md-4 col-sm-4 col-6"
                  key={cat._id}
                >
                  <button
                    className="single-category"
                    onClick={() =>
                      router.push(
                        `/products?categoryname=${cat.name.toLowerCase()}`
                      )
                    }
                  >
                    <div className="single-category-img">
                      <img src={`${base.cdnUrl}/${cat.picture}`} />
                    </div>
                    <h4 className="single-category-name"> {cat.name} </h4>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeMenu;
