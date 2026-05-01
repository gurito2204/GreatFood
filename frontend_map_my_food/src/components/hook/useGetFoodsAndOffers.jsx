import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useGetFoodsAndOffers = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const GetFoodsAndOffersData = async (type) => {
    const RestaurantId = fetchRestaurantId();
    const data = await api.get(/${type}/${RestaurantId}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        return [];
      });).catch(err => { console.error(err); return []; });
    return data;
  };
  return { GetFoodsAndOffersData };
};

export default useGetFoodsAndOffers;
