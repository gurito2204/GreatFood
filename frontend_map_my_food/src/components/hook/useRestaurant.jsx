import { api } from "../../services/api";


const useRestaurant = () => {
  const data = async (id) => {
    const data = await api.get(/restaurant/${id}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err);).catch(err => { console.error(err); return null; }); return null; });
    return data;
  };
  return { data };
};

export default useRestaurant;
