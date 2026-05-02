import { useContext } from "react";
import CartContext from "../store/cart/Cart-context";
import { useLocationLocalStorage } from "./LocationLocalStorage";
import { useNotification } from "./useNotification";
import { api } from "../../services/api";

const useUserOrder = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const cartContextCtx = useContext(CartContext);

  const userOrderData = async (
    cartItems,
    totalAmount,
    deliveryCost,
    GST,
    address
  ) => {
    const details = fetchPersonalDetails();
    if (!details || !details.data || !details.data.id) {
      NotificationHandler("Vui lòng đăng nhập để đặt hàng.", "Error");
      return "";
    }

    const userid = details.data.id;
    const body = {
      order: cartItems,
      totalAmount,
      deliveryCost,
      GST,
      address,
      restaurantId: cartContextCtx.RestaurantId,
      restaurantName: cartContextCtx.hotal,
    };

    try {
      const data = await api.post(`/userorder/${userid}`, body);
      NotificationHandler(data.message, "Info");
      return data.response || "";
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return "";
    }
  };
  return { userOrderData };
};

export default useUserOrder;
