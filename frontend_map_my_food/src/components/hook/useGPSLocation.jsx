import { useState } from "react";
import { api } from "../../services/api";
import VietnamCity from "../TemporaryData/VietnamCity.json";

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
  const [matchedCity, setMatchedCity] = useState(null);
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

          // Khớp dữ liệu với VietnamCity.json bằng Fuzzy Match thông minh
          // Thu thập tất cả các "gợi ý" từ Nominatim để đoán Phường/Quận
          const hints = [
            address.suburb, 
            address.quarter, 
            address.neighbourhood, 
            address.city_district, 
            address.county, 
            address.town, 
            address.city,
            address.state
          ].filter(Boolean);

          let match = null;

          // 1. Thử tìm chính xác Phường (ward)
          for (const hint of hints) {
            const possibleWards = VietnamCity.filter(c => c.name === hint || c.name === hint.replace("Phường ", ""));
            if (possibleWards.length === 1) {
              match = possibleWards[0];
              break;
            } else if (possibleWards.length > 1) {
              // Nhiều phường trùng tên (VD: "Phường 1"), dùng hint khác để lọc Quận
              for (const w of possibleWards) {
                if (hints.some(h => h !== hint && w.state.includes(h.replace("Quận ", "").replace("Thành phố ", "")))) {
                  match = w;
                  break;
                }
              }
              if (match) break;
            }
          }

          // 2. Nếu không tìm thấy Phường, thử tìm Quận (district)
          if (!match) {
            for (const hint of hints) {
              const cleanHint = hint.replace("Phường ", "").replace("Quận ", "").replace("Thành phố ", "").replace("TP ", "");
              if (cleanHint.length > 2) {
                const possibleDistricts = VietnamCity.filter(c => c.state.includes(cleanHint));
                if (possibleDistricts.length > 0) {
                  match = possibleDistricts[0]; // Lấy đại diện phường đầu tiên của Quận
                  break;
                }
              }
            }
          }

          if (match) {
            // Ghi đè bằng dữ liệu chuẩn
            const stateParts = match.state.split(",");
            if (stateParts.length >= 2) {
              district = stateParts[0].trim();
              province = stateParts[1].trim();
            }
            ward = match.name; // Cập nhật lại ward cho chuẩn
          } else {
            // Fallback
            match = {
              name: ward || district || "Khu vực",
              state: `${district ? district + ", " : ""}${province || "Việt Nam"}`,
              pincode: "700000"
            };
          }

          // Gom nhóm lại, bỏ các phần bị trống
          const parts = [road, ward, district, province].filter(Boolean);

          // Nếu parts có data thì nối lại, không thì fallback sang display_name
          const display = parts.length > 0
            ? parts.join(", ")
            : json.display_name?.split(",").slice(0, 3).join(",").trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          console.log("[GPS] coords:", lat, lng, "| display:", display);
          setDisplayAddress(display);
          setMatchedCity(match);
          setStatus("success");
        } catch (err) {
          // Nominatim thất bại nhưng vẫn có tọa độ → dùng tọa độ thô
          console.warn("[GPS] Nominatim failed, using raw coords:", err);
          setDisplayAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setMatchedCity({ name: "Tọa độ", state: "Việt Nam", pincode: "700000" });
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

  return { status, coords, displayAddress, matchedCity, error, getGPSLocation };
};

export default useGPSLocation;
