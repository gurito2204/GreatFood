import { api } from "../../services/api";

const useCategoryWiseFood = () => {
  const CategoryWiseFoodData = async (pincode, category) => {
    try {
      return await api.get(`/categorywisefood/${pincode}/${category}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { CategoryWiseFoodData };
};

export default useCategoryWiseFood;
