import { useNotification } from "./useNotification";
import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useAuth = () => {
  const { NotificationHandler } = useNotification();
  const { updatePersonalDetails } = useLocationLocalStorage();

  const Auth = async (body, type) => {
    try {
      const responsedata = await api.post(`/${type}`, body);
      NotificationHandler(responsedata.message, "Info");
      
      if (responsedata.navigate === "true" && type === "verify") {
        updatePersonalDetails(responsedata);
      }
      return responsedata.navigate;
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return "false";
    }
  };
  return { Auth };
};

export default useAuth;
