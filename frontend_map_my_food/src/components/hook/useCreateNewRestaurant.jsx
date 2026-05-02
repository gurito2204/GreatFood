import { useNotification } from "./useNotification";
import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useCreateNewRestaurantData = () => {
  const { NotificationHandler } = useNotification();
  const { fetchRestaurantId, fetchPersonalDetails } = useLocationLocalStorage();

  const CreateNewRestaurantData = async (
    data,
    page,
    type,
    id,
    imageToBackend
  ) => {
    const RestaurantId = fetchRestaurantId();
    const formData = new FormData();
    if (page === "restaurantfood") {
      formData.append("file", imageToBackend);
      formData.append("RestaurantId", RestaurantId);
      formData.append("itemId", id);
      formData.append("data", JSON.stringify([data]));
    } else if (page === "restaurantoffer") {
      formData.append("file", imageToBackend);
      formData.append("RestaurantId", RestaurantId);
      formData.append("offerId", id);
      formData.append("data", JSON.stringify([data]));
    } else if (page === "restaurant") {
      const PersonalDetails = fetchPersonalDetails();
      const userId = PersonalDetails?.data?.id || "";
      formData.append("file", imageToBackend);
      formData.append("userId", userId);
      formData.append("RestaurantId", RestaurantId);
      formData.append("data", JSON.stringify(data));
    }

    try {
      const path = `/${page}`;
      let responsedata;
      if (type.toUpperCase() === "POST") {
        responsedata = await api.post(path, formData);
      } else if (type.toUpperCase() === "PUT") {
        responsedata = await api.put(path, formData);
      } else {
        // Fallback for other types if any
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}${path}`, {
          method: type,
          body: formData,
        });
        responsedata = await response.json();
      }

      NotificationHandler(responsedata.message, "Info");
      return responsedata.response || [];
    } catch (err) {
      console.error(err);
      NotificationHandler("Check your connection!", "Error");
      return [];
    }
  };
  return { CreateNewRestaurantData };
};

export default useCreateNewRestaurantData;
