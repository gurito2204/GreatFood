import React, { useContext, useState, useEffect } from "react";
import classes from "./SearchRestaurantFood.module.css";
import SvgArrow from "../../../ui/Svg/SvgArrow";
import CartContext from "../../../store/cart/Cart-context";
import FlavorPreviewBar from "../../../FlavorPreviewBar/FlavorPreviewBar";
import ChatModal from "../../../ChatModal/ChatModal";
import TasteRatingModal from "../../../TasteRatingModal/TasteRatingModal";

import { useLocationLocalStorage } from "../../../hook/LocationLocalStorage";

const SearchRestaurantFood = ({ items, veg, data }) => {
  const cartContextCtx = useContext(CartContext);
  const { fetchRestaurantId } = useLocationLocalStorage();
  const myRestaurantId = fetchRestaurantId();
  
  // State for Modals
  const [activeTasteItem, setActiveTasteItem] = useState(null);
  const [activeChatItem, setActiveChatItem] = useState(null);

  const IncreseItem = (itemId, RestaurantId) => {
    cartContextCtx.onAddItems(RestaurantId, itemId);
  };
  const DecreaseItem = (itemId, RestaurantId) => {
    cartContextCtx.onRemoveItem(RestaurantId, itemId);
  };

  const [flavorData, setFlavorData] = useState({});

  useEffect(() => {
    const fetchAllRatings = async () => {
      const newFlavorData = {};
      for (const item of items || []) {
        try {
          const res = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/restaurant/food/${item.itemId}/rating`);
          if (res.ok) {
            const json = await res.json();
            if (json.data) {
              newFlavorData[item.itemId] = json.data;
            }
          }
        } catch (err) {
          console.error("Failed to fetch ratings for", item.itemId);
        }
      }
      setFlavorData(newFlavorData);
    };

    if (items && items.length > 0) {
      fetchAllRatings();
    }
  }, [items]);

  return (
    <div className={classes.container}>
      {items?.map((each_item, index_j) => {
        return (
          <div className={classes.item} key={index_j}>
            <div className={classes.item_part1}>
              <h1 className={classes.item_part1_hotal}>{data.Restaurant}</h1>
              <div className={classes.item_part1_star}>
                <img src="/swiggey/Search/logo/rating.jpg" alt="" />
                {each_item.star}
                {"   ...   "}
                {each_item.Dtime}
              </div>
              <div className={classes.svgarrow}>
                <SvgArrow />
              </div>
            </div>
            <div className={classes.item_part2}></div>
            <div className={classes.item_part3}>
              <div className={classes.item_part3_left}>
                <div className={classes.item_part3_name}>
                  {veg && <img src="/swiggey/Search/logo/veg.png" alt="" />}

                  {!veg && <img src="/swiggey/Search/logo/nonveg.jpg" alt="" />}
                  {each_item.name}
                </div>
                <div className={classes.item_part3_price}>
                  {each_item.price}
                </div>
                
                <FlavorPreviewBar flavors={flavorData[each_item.itemId]} showTop={2} />

                <div className={classes.item_part3_para}>
                  {each_item.description}
                </div>
                
                <div className={classes.c2c_actions}>
                   {myRestaurantId !== data.RestaurantId && (
                     <button 
                       className={classes.c2c_btn_deal}
                       onClick={() => setActiveChatItem(each_item)}
                     >
                       🤝 Deal / Hỏi
                     </button>
                   )}
                   <button 
                     className={classes.c2c_btn_rate}
                     onClick={() => setActiveTasteItem(each_item)}
                   >
                     ⭐ Đánh giá
                   </button>
                </div>
              </div>
              <div className={classes.item_part3_right}>
                <img
                  src={`${import.meta.env.VITE_REACT_BACKEND_URL}${
                    each_item.image
                  }`}
                  alt=""
                  onError={(event) => {
                    event.target.onerror = null;
                    event.target.src = each_item.image;
                  }}
                />
                {cartContextCtx.addItems.length !== 0 &&
                cartContextCtx.addItems.some(
                  (item) => item.itemId === each_item.itemId
                ) ? (
                  <div className={classes.item_quantity}>
                    <div
                      className={classes.item_quantity_less}
                      onClick={() => {
                        DecreaseItem(each_item.itemId, data.RestaurantId);
                      }}
                    >
                      -
                    </div>
                    <div className={classes.item_quantity_number}>
                      {
                        cartContextCtx.addItems.find(
                          (item) => item.itemId === each_item.itemId
                        ).quantity
                      }
                    </div>
                    <div
                      className={classes.item_quantity_more}
                      onClick={() => {
                        IncreseItem(each_item.itemId, data.RestaurantId);
                      }}
                    >
                      +
                    </div>
                  </div>
                ) : (
                  <div
                    className={classes.addButton}
                    onClick={() => {
                      IncreseItem(each_item.itemId, data.RestaurantId);
                    }}
                  >
                    ADD
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Modals */}
      <ChatModal 
        isOpen={!!activeChatItem} 
        onClose={() => setActiveChatItem(null)}
        seller={{
          name: "Nguyễn Văn A", // Mock seller
          phone: "0901 234 567",
          isOnline: true,
          restaurantId: data.RestaurantId
        }}
        prefillMessage={activeChatItem?.name}
      />

      <TasteRatingModal 
        isOpen={!!activeTasteItem}
        onClose={() => setActiveTasteItem(null)}
        menuItem={activeTasteItem}
        onSubmit={(raw, cal) => console.log("Submitted Ratings:", {raw, cal})}
      />

    </div>
  );
};

export default SearchRestaurantFood;
