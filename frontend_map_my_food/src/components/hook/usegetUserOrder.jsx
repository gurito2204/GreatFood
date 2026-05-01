import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const usegetUserOrder = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const userid = fetchPersonalDetails().data.id;
  const userOrderData = async () => {
    const data = await api.get(/userorder/${userid}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        return {};
      });).catch(err => { console.error(err); return null; });
    return data.response;
  };
  return { userOrderData };
};

export default usegetUserOrder;
