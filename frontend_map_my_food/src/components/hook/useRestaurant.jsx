

const useRestaurant = () => {
  const data = async (id) => {
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/restaurant/${id}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { data };
};

export default useRestaurant;
