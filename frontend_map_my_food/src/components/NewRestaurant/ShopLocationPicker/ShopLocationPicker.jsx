import React, { useState, useEffect } from "react";
import classes from "./ShopLocationPicker.module.css";
import useGPSLocation from "../../hook/useGPSLocation";
import VietnamCity from "../../TemporaryData/VietnamCity.json";

/**
 * ShopLocationPicker – Component chọn địa chỉ shop khi đăng ký.
 * Props:
 *   onChange({ location, pincode, lat, lng, address }) – callback lên parent
 */

// Build cascade data từ VietnamCity.json: { tinh: { quan: [phuong,...] } }
const buildCascadeData = () => {
  const map = {};
  VietnamCity.forEach((city) => {
    const parts = city.state.split(",").map((s) => s.trim());
    const quan = parts[0] || "";
    const tinh = parts[1] || "";
    if (!map[tinh]) map[tinh] = {};
    if (!map[tinh][quan]) map[tinh][quan] = [];
    map[tinh][quan].push({ name: city.name, pincode: city.pincode });
  });
  return map;
};

const cascadeData = buildCascadeData();

const ShopLocationPicker = ({ onChange }) => {
  const [tab, setTab] = useState("gps"); // 'gps' | 'manual'

  // GPS state
  const { status: gpsStatus, coords, matchedCity, error: gpsError, getGPSLocation } = useGPSLocation();
  const [gpsStreet, setGpsStreet] = useState("");

  // Manual state
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedQuan, setSelectedQuan] = useState(null);
  const [selectedPhuong, setSelectedPhuong] = useState(null);
  const [manStreet, setManStreet] = useState("");

  const tinhList = Object.keys(cascadeData).sort();
  const quanList = selectedTinh ? Object.keys(cascadeData[selectedTinh]).sort() : [];
  const phuongList = selectedTinh && selectedQuan ? cascadeData[selectedTinh][selectedQuan] : [];

  // GPS success → bubble up
  useEffect(() => {
    if (gpsStatus === "success" && matchedCity && coords) {
      const address = gpsStreet
        ? `${gpsStreet}, ${matchedCity.name}, ${matchedCity.state}, Việt Nam`
        : `${matchedCity.name}, ${matchedCity.state}, Việt Nam`;
      onChange &&
        onChange({
          location: matchedCity.state,
          pincode: matchedCity.pincode,
          lat: coords.lat,
          lng: coords.lng,
          address,
        });
    }
  }, [gpsStatus, matchedCity, coords, gpsStreet]);

  // Manual selection → bubble up when complete
  useEffect(() => {
    if (selectedPhuong) {
      const parts = [];
      if (manStreet) parts.push(manStreet);
      parts.push(selectedPhuong.name);
      if (selectedQuan) parts.push(selectedQuan);
      if (selectedTinh) parts.push(selectedTinh);
      parts.push("Việt Nam");
      const address = parts.join(", ");
      onChange &&
        onChange({
          location: selectedQuan ? `${selectedQuan}, ${selectedTinh}` : selectedTinh,
          pincode: selectedPhuong.pincode,
          lat: null,
          lng: null,
          address,
        });
    }
  }, [selectedPhuong, manStreet]);

  const handleSelectTinh = (tinh) => {
    setSelectedTinh(tinh);
    setSelectedQuan(null);
    setSelectedPhuong(null);
  };
  const handleSelectQuan = (quan) => {
    setSelectedQuan(quan);
    setSelectedPhuong(null);
  };
  const handleSelectPhuong = (phuong) => {
    setSelectedPhuong(phuong);
  };

  // Preview address for manual tab
  const previewAddress = (() => {
    if (!selectedTinh) return null;
    const parts = [];
    if (manStreet) parts.push(manStreet);
    if (selectedPhuong) parts.push(selectedPhuong.name);
    if (selectedQuan) parts.push(selectedQuan);
    parts.push(selectedTinh);
    parts.push("Việt Nam");
    return parts.join(", ");
  })();

  return (
    <div className={classes.wrapper}>
      <div className={classes.sectionLabel}>📍 Địa chỉ shop của bạn</div>

      {/* Tab bar */}
      <div className={classes.tabBar}>
        <button
          className={`${classes.tabBtn} ${tab === "gps" ? classes.tabActive : ""}`}
          onClick={() => setTab("gps")}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          </svg>
          Dùng GPS
        </button>
        <button
          className={`${classes.tabBtn} ${tab === "manual" ? classes.tabActive : ""}`}
          onClick={() => setTab("manual")}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M4 6h16M4 12h16M4 18h10"/>
          </svg>
          Chọn thủ công
        </button>
      </div>

      {/* GPS Tab */}
      {tab === "gps" && (
        <div className={classes.gpsTab}>
          <button
            type="button"
            className={`${classes.gpsBtn} ${gpsStatus === "loading" ? classes.gpsLoading : ""} ${gpsStatus === "success" ? classes.gpsSuccess : ""}`}
            onClick={getGPSLocation}
            disabled={gpsStatus === "loading"}
          >
            {gpsStatus === "loading" ? (
              <><span className={classes.spinner}></span> Đang xác định vị trí...</>
            ) : gpsStatus === "success" ? (
              <>✅ Đã lấy vị trí thành công</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
                Lấy vị trí hiện tại
              </>
            )}
          </button>

          {gpsStatus === "success" && matchedCity && (
            <div className={classes.gpsResult}>
              <strong>📍 {matchedCity.name}, {matchedCity.state}</strong>
              <span>Pincode: {matchedCity.pincode}</span>
            </div>
          )}
          {gpsStatus === "error" && (
            <div className={classes.gpsError}>⚠️ {gpsError}</div>
          )}

          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Số nhà / Tên đường</label>
            <input
              className={classes.fieldInput}
              type="text"
              placeholder="VD: 123 Nguyễn Văn Linh"
              value={gpsStreet}
              onChange={(e) => setGpsStreet(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Manual Tab */}
      {tab === "manual" && (
        <div className={classes.manualTab}>
          {/* 3-column cascade */}
          <div className={classes.colWrapper}>
            {/* Tỉnh/Thành */}
            <div className={classes.col}>
              <div className={classes.colHeader}>Tỉnh / Thành</div>
              {tinhList.map((tinh) => (
                <div
                  key={tinh}
                  className={`${classes.colItem} ${selectedTinh === tinh ? classes.colSelected : ""}`}
                  onClick={() => handleSelectTinh(tinh)}
                >
                  {tinh}
                </div>
              ))}
            </div>

            {/* Quận/Huyện */}
            <div className={classes.col}>
              <div className={classes.colHeader}>Quận / Huyện</div>
              {quanList.length === 0 ? (
                <div className={classes.colDisabled}>← Chọn Tỉnh trước</div>
              ) : (
                quanList.map((quan) => (
                  <div
                    key={quan}
                    className={`${classes.colItem} ${selectedQuan === quan ? classes.colSelected : ""}`}
                    onClick={() => handleSelectQuan(quan)}
                  >
                    {quan}
                  </div>
                ))
              )}
            </div>

            {/* Phường/Xã */}
            <div className={classes.col}>
              <div className={classes.colHeader}>Phường / Xã</div>
              {phuongList.length === 0 ? (
                <div className={classes.colDisabled}>← Chọn Quận trước</div>
              ) : (
                phuongList.map((p) => (
                  <div
                    key={p.name}
                    className={`${classes.colItem} ${selectedPhuong?.name === p.name ? classes.colSelected : ""}`}
                    onClick={() => handleSelectPhuong(p)}
                  >
                    {p.name}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Số nhà / đường */}
          <div className={classes.fieldGroup}>
            <label className={classes.fieldLabel}>Số nhà / Tên đường</label>
            <input
              className={classes.fieldInput}
              type="text"
              placeholder="VD: 123 Lê Lợi"
              value={manStreet}
              onChange={(e) => setManStreet(e.target.value)}
            />
          </div>

          {/* Live preview */}
          {previewAddress && (
            <div className={classes.preview}>
              <div className={classes.previewLabel}>Địa chỉ đầy đủ</div>
              <div className={classes.previewVal}>{previewAddress}</div>
              {selectedPhuong && (
                <div className={classes.previewPincode}>Pincode: {selectedPhuong.pincode}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopLocationPicker;
