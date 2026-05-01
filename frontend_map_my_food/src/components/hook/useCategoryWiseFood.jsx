
import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useCategoryWiseFood = () => {
  const { fetchPincode } = useLocationLocalStorage();
  const pincode = fetchPincode();
  const CategoryWiseFoodData = async () => {
    const data = await api.get(/categorywisefood/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err);).catch(err => { console.error(err); return null; }); return null; });
    return data;
  };
  return { CategoryWiseFoodData };
};

export default useCategoryWiseFood;
