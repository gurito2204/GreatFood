import { api } from "../../services/api";

const usePaymentOffers = () => {
  const data = async (pincode) => {
    try {
      return await api.get(`/offers/${pincode}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return { data };
};

export default usePaymentOffers;
