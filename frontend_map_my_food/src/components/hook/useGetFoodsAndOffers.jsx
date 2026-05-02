import { api } from "../../services/api";

const useGetFoodsAndOffers = () => {
  const GetFoodsAndOffersData = async (id) => {
    try {
      return await api.get(`/restaurant/all/${id}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return { GetFoodsAndOffersData };
};

export default useGetFoodsAndOffers;
