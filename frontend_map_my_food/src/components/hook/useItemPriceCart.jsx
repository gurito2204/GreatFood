import { api } from "../../services/api";

const useItemPriceCart = () => {
  const ItemPriceCartData = async (RestaurantId, itemId) => {
    const data = await api.get(`/ItemPriceCart/${RestaurantId}/${itemId}`)
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { ItemPriceCartData };
};

export default useItemPriceCart;
