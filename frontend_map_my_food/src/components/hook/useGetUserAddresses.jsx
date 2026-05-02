import { api } from "../../services/api";

const useGetUserAddresses = () => {
  const getUserAddressesData = async (userId) => {
    try {
      return await api.get(`/user/addresses/${userId}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { getUserAddressesData };
};

export default useGetUserAddresses;
