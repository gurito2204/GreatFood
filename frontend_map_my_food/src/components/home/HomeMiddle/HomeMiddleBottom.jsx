import React from "react";
import classes from "./HomeMiddleBottom.module.css";

const HomeMiddleBottom = () => {
  return (
    <div className={classes.box}>
      <div className={classes.left}>
        <div className={classes.part1}>
          <h1>Nhà hàng trong túi bạn</h1>
          <p>
            Đặt món từ các nhà hàng yêu thích và theo dõi trên mọi nẻo đường, với ứng dụng GreatFood hoàn toàn mới.
          </p>
        </div>
        <div className={classes.part2}>
          <img src="/swiggey/Logo/googlePlay.png" alt="googlePlay" />
          <img src="/swiggey/Logo/appStore.png" alt="appStore" />
        </div>
      </div>
      <div className={classes.right}>
        <div className={classes.rightfirst}>
          <img src="/swiggey/PhoneView/lower.png" alt="lower" />
        </div>
        <div className={classes.rightsecond}>
          <img src="/swiggey/PhoneView/upper.webp" alt="upper" />
        </div>
      </div>
    </div>
  );
};

export default HomeMiddleBottom;
