import { api } from "../../services/api";

const useGetUserAddresses = () => {
  const GetUserAddressesData = async (userId) => {
    try {
      return await api.get(`/user/addresses/${userId}`);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { GetUserAddressesData };
};

export default useGetUserAddresses;
