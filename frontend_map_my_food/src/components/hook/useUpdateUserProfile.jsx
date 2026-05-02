import { useLocationLocalStorage } from "./LocationLocalStorage";
import { useNotification } from "./useNotification";
import { api } from "../../services/api";

const useUpdateUserProfile = () => {
  const { fetchPersonalDetails, updatePersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();

  const UpdateUserProfileData = async (place, newdata) => {
    const details = fetchPersonalDetails();
    if (!details || !details.data || !details.data.id) return "";

    const id = details.data.id;
    try {
      const data = await api.post(`/updateprofile/${id}/${place}/${newdata}`, {});
      NotificationHandler(place + " " + data.message, "Info");
      
      // Update local state if successful
      const updatedDetails = { ...details };
      if (place === "number") {
        updatedDetails.data.number = newdata;
        updatePersonalDetails(updatedDetails);
      } else if (place === "email") {
        updatedDetails.data.email = newdata; // Fixed: was using .number before
        updatePersonalDetails(updatedDetails);
      }
      
      return data.response || "";
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return "";
    }
  };
  return { UpdateUserProfileData };
};

export default useUpdateUserProfile;
