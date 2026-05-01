import React from "react";
import classes from "./HomeMiddleTop.module.css";

const HomeMiddleTop = () => {
  const datas = [
    {
      image: "/greatfood/trackMyFood/noMinOrder.png",
      heading: "Theo Dõi Đơn Hàng",
      para: "Biết chính xác đơn hàng của bạn đang ở đâu, từ nhà hàng đến tận cửa nhà",
    },
    {
      image: "/greatfood/trackMyFood/liveOrder.png",
      heading: "Không Giới Hạn Đơn Tối Thiểu",
      para: "Đặt món cho bạn hoặc cả nhóm, không giới hạn giá trị đơn hàng",
    },
    {
      image: "/greatfood/trackMyFood/superFastDelivery.png",
      heading: "Giao Hàng Siêu Tốc",
      para: "Trải nghiệm giao hàng siêu tốc của GreatFood, đảm bảo đồ ăn luôn tươi ngon và đúng giờ",
    },
  ];
  return (
    <div className={classes.box}>
      <div className={classes.row}>
        {datas.map((data, index) => {
          return (
            <div className={classes.item} key={index}>
              <div className={classes.image}>
                <img src={data.image} alt="" />
              </div>
              <div className={classes.heading}>{data.heading}</div>
              <div className={classes.para}> {data.para}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeMiddleTop;
