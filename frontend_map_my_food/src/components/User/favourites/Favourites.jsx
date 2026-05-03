import React from "react";
import classes from "./Favourites.module.css";
import { Link } from "react-router-dom";
const Favourites = () => {
  return (
    <div className={classes.container}>
      <img src="/greatfood/User/empty404.webp" alt="" />
      <h1>Tính năng đang phát triển</h1>
      <p>
        Tính năng nhà hàng yêu thích sẽ sớm ra mắt trong các phiên bản tiếp theo.
        Vui lòng quay lại sau!
      </p>
      <Link to={"/"}>
        <button>QUAY VỀ TRANG CHỦ</button>
      </Link>
    </div>
  );
};

export default Favourites;
