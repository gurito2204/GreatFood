import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const usegetUserOrder = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  
  const userOrderData = async () => {
    const details = fetchPersonalDetails();
    if (!details || !details.data || !details.data.id) return [];
    
    const userid = details.data.id;
    try {
      const data = await api.get(`/userorder/${userid}`);
      return data.response || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { userOrderData };
};

export default usegetUserOrder;
