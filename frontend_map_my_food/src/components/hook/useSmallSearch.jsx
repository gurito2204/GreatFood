import { api } from "../../services/api";

const useSmallSearch = () => {
  const smallSearch = async (search) => {
    try {
      return await api.get(`/smallSearch/${search}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { smallSearch };
};

export default useSmallSearch;
