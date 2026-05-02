import { api } from "../../services/api";

const useRestaurant = () => {
  const RestaurantData = async (id) => {
    try {
      return await api.get(`/restaurant/${id}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return { RestaurantData };
};

export default useRestaurant;
