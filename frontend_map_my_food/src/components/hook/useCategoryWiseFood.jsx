import { api } from "../../services/api";

const useCategoryWiseFood = () => {
  const CategoryWiseFoodData = async (pincode) => {
    try {
      return await api.get(`/categorywisefood/${pincode}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { CategoryWiseFoodData };
};

export default useCategoryWiseFood;
