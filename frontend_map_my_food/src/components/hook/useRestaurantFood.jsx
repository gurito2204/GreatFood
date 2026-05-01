

const useRestaurantFood = () => {
  const RestaurantFoodData = async (id) => {
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/restaurantfood/${id}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { RestaurantFoodData };
};

export default useRestaurantFood;
