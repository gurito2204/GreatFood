import React, { useContext, useState, useEffect } from "react";
import classes from "./SearchRestaurantFood.module.css";
import SvgArrow from "../../../ui/Svg/SvgArrow";
import CartContext from "../../../store/cart/Cart-context";
import FlavorPreviewBar from "../../../FlavorPreviewBar/FlavorPreviewBar";
import ChatModal from "../../../ChatModal/ChatModal";
import TasteRatingModal from "../../../TasteRatingModal/TasteRatingModal";

import { useLocationLocalStorage } from "../../../hook/LocationLocalStorage";
import useItemPriceCart from "../../../hook/useItemPriceCart";
import { api } from "../../../../services/api";

const SearchRestaurantFood = ({ items, veg, data }) => {
  const cartContextCtx = useContext(CartContext);
  const { fetchRestaurantId } = useLocationLocalStorage();
  const myRestaurantId = fetchRestaurantId();
  const { ItemPriceCartData } = useItemPriceCart();
  const [loadingItems, setLoadingItems] = useState({});
  
  // State for Modals
  const [activeTasteItem, setActiveTasteItem] = useState(null);
  const [activeChatItem, setActiveChatItem] = useState(null);

  const IncreseItem = async (itemId, RestaurantId) => {
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
    try {
      const dataItemPriceCart = await ItemPriceCartData(RestaurantId, itemId);
      if (dataItemPriceCart && dataItemPriceCart[itemId]) {
        cartContextCtx.onAddItems(RestaurantId, itemId, dataItemPriceCart[itemId]);
      }
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
    }
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
          const json = await api.get(`/restaurant/food/${item.itemId}/rating`);
          if (json.data) {
            newFlavorData[item.itemId] = json.data;
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
                <img src="/greatfood/Search/logo/rating.jpg" alt="" />
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
                  {veg && <img src="/greatfood/Search/logo/veg.png" alt="" />}

                  {!veg && <img src="/greatfood/Search/logo/nonveg.jpg" alt="" />}
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
                  <button
                    className={classes.addButton}
                    onClick={() => {
                      IncreseItem(each_item.itemId, data.RestaurantId);
                    }}
                    disabled={loadingItems[each_item.itemId]}
                  >
                    {loadingItems[each_item.itemId] ? "..." : "ADD"}
                  </button>
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
          name: data.Restaurant || "Nhà hàng", 
          phone: data.phone_number || "Đang cập nhật",
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
