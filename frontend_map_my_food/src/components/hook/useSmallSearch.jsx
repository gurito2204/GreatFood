import { api } from "../../services/api";

const useSmallSearch = () => {
  const SmallSearchData = async (search) => {
    try {
      return await api.get(`/smallSearch/${search}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { SmallSearchData };
};

export default useSmallSearch;
