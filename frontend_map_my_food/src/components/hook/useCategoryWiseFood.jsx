
import { useLocationLocalStorage } from "./LocationLocalStorage";

const useCategoryWiseFood = () => {
  const { fetchPincode } = useLocationLocalStorage();
  const pincode = fetchPincode();
  const CategoryWiseFoodData = async () => {
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/categorywisefood/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { CategoryWiseFoodData };
};

export default useCategoryWiseFood;
