import { api } from "../../services/api";


const usePaymentOffers = () => {
  const data = async (pincode) => {
    const data = await api.get(/offers/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err);).catch(err => { console.error(err); return null; }); return null; });
    return data;
  };
  return { data };
};

export default usePaymentOffers;
