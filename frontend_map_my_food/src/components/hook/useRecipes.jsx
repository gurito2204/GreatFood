
import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useRecipes = () => {
  const { fetchPincode } = useLocationLocalStorage();
  const pincode = fetchPincode();
  const RecipesData = async () => {
    const data = await api.get(/recipes/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err);).catch(err => { console.error(err); return null; }); return null; });
    return data;
  };
  return { RecipesData };
};

export default useRecipes;
