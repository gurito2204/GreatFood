import { api } from "../../services/api";

const useRestaurantFood = () => {
  const RestaurantFoodData = async (id) => {
    try {
      return await api.get(`/restaurantfood/${id}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return { RestaurantFoodData };
};

export default useRestaurantFood;
