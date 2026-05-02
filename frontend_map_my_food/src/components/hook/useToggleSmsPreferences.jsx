import { useLocationLocalStorage } from "./LocationLocalStorage";
import { useNotification } from "./useNotification";
import { api } from "../../services/api";

const useToggleSmsPreferences = () => {
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();

  const ToggleSmsPreferencesData = async () => {
    const details = fetchPersonalDetails();
    if (!details || !details.data || !details.data.id) return "";

    const id = details.data.id;
    try {
      const data = await api.post(`/smsPreferences/${id}`, {});
      NotificationHandler(data.message, "Info");
      return data.response || "";
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return "";
    }
  };
  return { ToggleSmsPreferencesData };
};

export default useToggleSmsPreferences;
