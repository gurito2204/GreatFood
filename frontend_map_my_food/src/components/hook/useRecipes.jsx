
import { useLocationLocalStorage } from "./LocationLocalStorage";

const useRecipes = () => {
  const { fetchPincode } = useLocationLocalStorage();
  const pincode = fetchPincode();
  const RecipesData = async () => {
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/recipes/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { RecipesData };
};

export default useRecipes;
