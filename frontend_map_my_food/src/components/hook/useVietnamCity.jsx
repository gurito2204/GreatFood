import VietnamCity from "../TemporaryData/VietnamCity.json";

const useVietnamCitys = (searchWord) => {
  // Nếu chưa gõ gì thì trả về mảng rỗng
  if (!searchWord || searchWord.trim() === "") {
    return { newVietnamCity: [] };
  }

  // Hàm "hóa phép" loại bỏ dấu Tiếng Việt để so sánh cho chuẩn
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .toLowerCase();
  };

  const searchLower = removeAccents(searchWord);

  // Lọc ra các địa điểm khớp với từ khóa (khớp tên quận hoặc tên tỉnh)
  const filteredCities = VietnamCity.filter((city) => {
    const cityNameMatch = removeAccents(city.name).includes(searchLower);
    const stateNameMatch = removeAccents(city.state).includes(searchLower);
    return cityNameMatch || stateNameMatch;
  });

  // Ép format lại thành chuỗi giống code gốc: "Quận 1 , Hồ Chí Minh , Việt Nam"
  const newVietnamCity = filteredCities.map(
    (city) => `${city.name} , ${city.state} , Việt Nam`
  );

  // Giới hạn kết quả trả về tối đa 5 cái cho đỡ rối UI
  return { newVietnamCity: newVietnamCity.slice(0, 5) };
};

export default useVietnamCitys;
