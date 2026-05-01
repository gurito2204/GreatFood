import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";
import { useNotification } from "./useNotification";

const useGetUserAddresses = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const getUserAddressesData = async () => {
    const id = fetchPersonalDetails().data.id;
    const data = await api.get(/useraddresses/${id}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);).catch(err => { console.error(err); return null; });
        const errorData = { response: [] };
        NotificationHandler("Check your connection!", "Error");
        return errorData;
      });
    return data.response;
  };
  return { getUserAddressesData };
};

export default useGetUserAddresses;
