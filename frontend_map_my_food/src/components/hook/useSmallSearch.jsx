import { api } from "../../services/api";


const useSmallSearch = () => {
  const smallSearch = async (search) => {
    const data = await api.get(/smallSearch/${search}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        const newSearchItemData = SmallSearch.filter((obj) =>
          Object.keys(obj).some((key) =>
            key.trim().toLowerCase().includes(search.trim().toLowerCase())
          )
        );).catch(err => { console.error(err); return null; });
        return newSearchItemData;
      });
    return data;
  };
  return { smallSearch };
};

export default useSmallSearch;
