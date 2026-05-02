import { api } from "../../services/api";

const useRecipes = () => {
  const RecipesData = async (pincode) => {
    try {
      return await api.get(`/recipes/${pincode}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { RecipesData };
};

export default useRecipes;
