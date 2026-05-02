import { api } from "../../services/api";

const usePaymentOffers = () => {
  const PaymentOffersData = async (pincode) => {
    try {
      return await api.get(`/offers/${pincode}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  return { PaymentOffersData };
};

export default usePaymentOffers;
