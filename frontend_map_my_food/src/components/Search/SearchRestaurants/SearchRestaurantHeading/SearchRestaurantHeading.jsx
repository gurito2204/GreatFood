import React, { useState } from "react";
import classes from "./SearchRestaurantHeading.module.css";
import Svgsearch from "../../../ui/Svg/Svgsearch";
import SvgDuration from "../../../ui/Svg/SvgDuration";
import SvgPrice from "../../../ui/Svg/SvgPrice";
import ChatModal from "../../../ChatModal/ChatModal"; // We will create this component

// Mock Data for C2C Phase 1
const MOCK_SELLER = {
  sellerName: "Nguyễn Văn A",
  sellerType: "Hộ kinh doanh cá nhân",
  phone: "0901 234 567",
  isOpen: true,
};

const SearchRestaurantHeading = ({ data }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.part1}>
        <div className={classes.address}>{data.address || "123 Đường ABC, TP.HCM"}</div>
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
                {MOCK_SELLER.isOpen ? " 🟢 Đang mở" : " 🔴 Đóng cửa"}
              </span>
            </h1>
            <h4>👤 {MOCK_SELLER.sellerName} ({MOCK_SELLER.sellerType})</h4>
            <p>📍 {data.location} , {data.distance}</p>
            <p className={classes.phoneNumber}>📞 {data.phone_number || MOCK_SELLER.phone}</p>
          </div>
          <div className={classes.part2_left_bottom}>
             <button className={classes.chatBtn} onClick={() => setIsChatOpen(true)}>
                💬 Nhắn tin để deal giá / hỏi freeship
             </button>
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
          name: MOCK_SELLER.sellerName,
          phone: data.phone_number || MOCK_SELLER.phone,
          isOnline: MOCK_SELLER.isOpen,
          restaurantId: data.RestaurantId
        }}
      />
    </div>
  );
};

export default SearchRestaurantHeading;
