import { useState } from "react";
import { api } from "../../services/api";

/**
 * useGPSLocation – SIMPLIFIED
 * Chỉ làm 2 việc:
 *   1. Lấy lat/lng từ browser GPS
 *   2. Gọi Nominatim để lấy tên địa chỉ hiển thị
 * KHÔNG còn match VietnamCity.json hay pincode nữa.
 *
 * Returns: { status, coords, displayAddress, error, getGPSLocation }
 *   status: 'idle' | 'loading' | 'success' | 'error'
 *   coords: { lat, lng } hoặc null
 *   displayAddress: tên địa chỉ từ Nominatim (string) hoặc null
 */
const useGPSLocation = () => {
  const [status, setStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [displayAddress, setDisplayAddress] = useState(null);
  const [error, setError] = useState(null);

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Trình duyệt của bạn không hỗ trợ GPS.");
      return;
    }

    setStatus("loading");
    setError(null);
    setCoords(null);
    setDisplayAddress(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          const json = await api.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
          const address = json.address || {};

          // Trích xuất các thành phần địa chỉ từ Nominatim
          let road = address.road || "";
          let ward = address.suburb || address.quarter || address.neighbourhood || "";
          let district = address.city_district || address.county || address.town || "";
          let province = address.state || address.province || "";

          // Nominatim thường map các Thành phố trực thuộc tỉnh vào `city`
          // và các Thành phố trực thuộc TW vào `state` hoặc `city`
          if (address.city) {
            if (!province) {
              province = address.city;
            } else if (address.city !== province) {
              // Có cả city và state -> city thường là Quận/Huyện/Thành phố trực thuộc tỉnh
              district = address.city;
            }
          }

          // Fix case đặc biệt: Thành phố Thủ Đức
          if (province.includes("Thủ Đức") || district.includes("Thủ Đức")) {
            district = district.includes("Thủ Đức") ? district : province;
            province = "Thành phố Hồ Chí Minh";
          }

          // Gom nhóm lại, bỏ các phần bị trống
          const parts = [road, ward, district, province].filter(Boolean);

          // Nếu parts có data thì nối lại, không thì fallback sang display_name
          const display = parts.length > 0
            ? parts.join(", ")
            : json.display_name?.split(",").slice(0, 3).join(",").trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          console.log("[GPS] coords:", lat, lng, "| display:", display);
          setDisplayAddress(display);
          setStatus("success");
        } catch (err) {
          // Nominatim thất bại nhưng vẫn có tọa độ → dùng tọa độ thô
          console.warn("[GPS] Nominatim failed, using raw coords:", err);
          setDisplayAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setStatus("success");
        }
      },
      (err) => {
        setStatus("error");
        if (err.code === 1) {
          setError(
            "Trình duyệt đang chặn GPS cho trang này. Bấm vào biểu tượng 🔒 trên thanh địa chỉ → Vị trí → Cho phép → tải lại trang và thử lại."
          );
        } else if (err.code === 2) {
          setError("Không bắt được tín hiệu GPS. Kiểm tra kết nối mạng hoặc bật Location Services.");
        } else {
          setError("GPS phản hồi quá chậm. Vui lòng thử lại.");
        }
      },
      { timeout: 12000, maximumAge: 30000, enableHighAccuracy: false }
    );
  };

  return { status, coords, displayAddress, error, getGPSLocation };
};

export default useGPSLocation;
