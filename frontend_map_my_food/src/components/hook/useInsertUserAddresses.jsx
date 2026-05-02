import { useLocationLocalStorage } from "./LocationLocalStorage";
import { useNotification } from "./useNotification";
import { api } from "../../services/api";

const useInsertUserAddresses = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();

  const insertUserAddressesData = async (address, type) => {
    const details = fetchPersonalDetails();
    if (!details || !details.data || !details.data.id) {
      NotificationHandler("Vui lòng đăng nhập để lưu địa chỉ.", "Error");
      return [];
    }
    const id = details.data.id;
    const body = { address };

    try {
      const path = `/useraddresses/${id}`;
      let data;
      if (type.toUpperCase() === "POST") {
        data = await api.post(path, body);
      } else if (type.toUpperCase() === "PUT") {
        data = await api.put(path, body);
      } else {
        data = await api.delete(path);
      }
      
      NotificationHandler(data.message, "Info");
      return data.response || [];
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return [];
    }
  };
  return { insertUserAddressesData };
};

export default useInsertUserAddresses;
