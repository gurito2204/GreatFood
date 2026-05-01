

const usePaymentOffers = () => {
  const data = async (pincode) => {
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/offers/${pincode}`
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => { console.error(err); return null; });
    return data;
  };
  return { data };
};

export default usePaymentOffers;
