import { api } from "../../services/api";


const useRestaurantFood = () => {
  const RestaurantFoodData = async (id) => {
    const data = await api.get(/restaurantfood/${id}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err);).catch(err => { console.error(err); return null; }); return null; });
    return data;
  };
  return { RestaurantFoodData };
};

export default useRestaurantFood;
