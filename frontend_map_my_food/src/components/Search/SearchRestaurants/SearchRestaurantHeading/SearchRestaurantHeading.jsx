import React, { useState } from "react";
import classes from "./SearchRestaurantHeading.module.css";
import Svgsearch from "../../../ui/Svg/Svgsearch";
import SvgDuration from "../../../ui/Svg/SvgDuration";
import SvgPrice from "../../../ui/Svg/SvgPrice";
import ChatModal from "../../../ChatModal/ChatModal";
import GoogleMapsLink from "../../../ui/GoogleMapsLink/GoogleMapsLink";

const SearchRestaurantHeading = ({ data }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Dùng data thật từ DB thay vì MOCK_SELLER
  const shopIsOpen = data.isOpen !== undefined ? data.isOpen : true;

  return (
    <div className={classes.container}>
      <div className={classes.part1}>
        <div className={classes.address}>
            <GoogleMapsLink lat={data.lat} lng={data.lng} address={data.address}>
              {data.address || "Đang cập nhật địa chỉ"}
            </GoogleMapsLink>
          </div>
        <div className={classes.search_logo}>
          <Svgsearch />
        </div>
      </div>
      <div className={classes.part2}>
        <div className={classes.part2_left}>
          <div className={classes.part2_left_top}>
            <h1>
              {data.Restaurant}
              <span className={classes.statusBadge}>
                {shopIsOpen ? " 🟢 Đang mở" : " 🔴 Đóng cửa"}
              </span>
            </h1>
            <p>
              <GoogleMapsLink lat={data.lat} lng={data.lng} address={data.address || data.location}>
                📍 {data.location} {data.distance && `, ${data.distance}`}
              </GoogleMapsLink>
            </p>
            <p className={classes.phoneNumber}>📞 {data.phone_number || "Đang cập nhật"}</p>
            {data.opening_hours && (
              <p className={classes.openingHours}>🕐 {data.opening_hours}</p>
            )}
          </div>
          <div className={classes.part2_left_bottom}>
            {shopIsOpen ? (
              <button className={classes.chatBtn} onClick={() => setIsChatOpen(true)}>
                💬 Nhắn tin để deal giá / hỏi freeship
              </button>
            ) : (
              <div className={classes.closedBanner}>
                🔴 Quán đang đóng cửa — Không thể đặt hàng lúc này
              </div>
            )}
          </div>
        </div>
        <div className={classes.part2_right}>
          <div className={classes.part2_right_top}>
            <img src="/greatfood/Search/logo/star.png" alt="" />
            <span>{data.rating}</span>
          </div>
          <div className={classes.part2_right_bottom}>
            {data.ratingCount} ratings
          </div>
        </div>
      </div>
      <div className={classes.part3}>
        <div className={classes.part3_1}>
          <SvgDuration />
          {"   "}
          {data.time}
        </div>
        <div className={classes.part3_2}>
          <SvgPrice />
          {"   "}
          {data.price}
        </div>
      </div>
      <div className={classes.part4}>
        {data.offers?.map((offer, index) => (
          <div key={index} className={classes.part4_offer}>
            <div className={classes.part4_offer_top}>
              <img src={offer.image} alt="logo" />
              {offer.percentage}
            </div>
            <div className={classes.part4_offer_bottom}>{offer.above}</div>
          </div>
        ))}
      </div>
      
      {/* Chat Modal Integration */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        seller={{
          name: data.Restaurant || "Nhà hàng",
          phone: data.phone_number || "Đang cập nhật",
          isOnline: shopIsOpen,
          restaurantId: data.RestaurantId
        }}
      />
    </div>
  );
};

export default SearchRestaurantHeading;
