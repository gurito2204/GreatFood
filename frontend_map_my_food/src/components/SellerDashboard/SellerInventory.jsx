import React, { useEffect, useState } from "react";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { api } from "../../services/api";
import classes from "./SellerInventory.module.css";

const SellerInventory = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const fetchFoods = async () => {
    if (!restaurantId) return;
    try {
      const data = await api.get(`/restaurantallfood/${restaurantId}`);
      // data trả về array food items
      const items = Array.isArray(data) ? data : (data.response || []);
      setFoods(items.map(f => ({
        ...f,
        stock: f.stock ?? -1,
        available: f.available !== undefined ? f.available : true,
      })));
    } catch (err) {
      console.error("Failed to fetch foods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [restaurantId]);

  const updateField = async (itemId, field, value) => {
    setSaving(prev => ({ ...prev, [itemId]: true }));
    try {
      const body = { [field]: value };
      // Nếu set stock = 0, auto set available = false
      if (field === "stock" && value === 0) {
        body.available = false;
      }
      await api.put(`/api/food/${itemId}/stock`, body);
      // Update local state
      setFoods(prev => prev.map(f => {
        if (f.itemId !== itemId) return f;
        const updated = { ...f, ...body };
        return updated;
      }));
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const toggleAvailable = (item) => {
    updateField(item.itemId, "available", !item.available);
  };

  const handleStockChange = (item, newValue) => {
    const val = newValue === "" ? -1 : parseInt(newValue, 10);
    if (isNaN(val)) return;
    setFoods(prev => prev.map(f => f.itemId === item.itemId ? { ...f, stock: val } : f));
  };

  const saveStock = (item) => {
    updateField(item.itemId, "stock", item.stock);
  };

  // Inline price edit handlers
  const handlePriceChange = (item, newValue) => {
    setFoods(prev => prev.map(f => f.itemId === item.itemId ? { ...f, price: newValue } : f));
  };

  const savePrice = (item) => {
    updateField(item.itemId, "price", item.price);
  };

  if (loading) return <div className={classes.loading}>Đang tải kho hàng...</div>;
  if (!restaurantId) return <div className={classes.loading}>Bạn chưa đăng ký gian hàng nào!</div>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>📦 Quản Lý Kho Hàng</h1>
      <p className={classes.subtitle}>Bật/tắt món, điều chỉnh tồn kho và giá nhanh chóng</p>

      {foods.length === 0 ? (
        <div className={classes.empty}>
          <div className={classes.emptyIcon}>🍽️</div>
          <p>Chưa có món ăn nào. Thêm món trong phần "Quản lý gian hàng".</p>
        </div>
      ) : (
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.thNum}>#</th>
                <th className={classes.thImage}></th>
                <th className={classes.thName}>Món ăn</th>
                <th className={classes.thPrice}>Giá</th>
                <th className={classes.thStock}>Tồn kho</th>
                <th className={classes.thStatus}>Trạng thái</th>
                <th className={classes.thAction}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((item, idx) => (
                <tr key={item.itemId || idx} className={!item.available ? classes.rowDisabled : ""}>
                  <td className={classes.tdNum}>{idx + 1}</td>
                  <td className={classes.tdImage}>
                    {item.image && (
                      <img
                        src={`${import.meta.env.VITE_REACT_BACKEND_URL}${item.image}`}
                        alt={item.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = item.image; }}
                      />
                    )}
                  </td>
                  <td className={classes.tdName}>
                    <div className={classes.foodName}>{item.name}</div>
                    {item.category && <div className={classes.foodCat}>{item.category}</div>}
                  </td>
                  <td className={classes.tdPrice}>
                    <div className={classes.priceInput}>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => handlePriceChange(item, e.target.value)}
                        onBlur={() => savePrice(item)}
                        onKeyDown={(e) => { if (e.key === "Enter") savePrice(item); }}
                        className={classes.priceField}
                      />
                    </div>
                  </td>
                  <td className={classes.tdStock}>
                    <div className={classes.stockInput}>
                      <input
                        type="number"
                        min="-1"
                        value={item.stock}
                        onChange={(e) => handleStockChange(item, e.target.value)}
                        onBlur={() => saveStock(item)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveStock(item); }}
                        className={classes.stockField}
                      />
                      {item.stock === -1 && <span className={classes.stockInf}>∞</span>}
                      {item.stock === 0 && <span className={classes.stockZero}>Hết</span>}
                    </div>
                  </td>
                  <td className={classes.tdStatus}>
                    <span
                      className={`${classes.statusDot} ${item.available ? classes.statusOn : classes.statusOff}`}
                    >
                      {item.available ? "🟢 Đang bán" : "🔴 Tạm ẩn"}
                    </span>
                  </td>
                  <td className={classes.tdAction}>
                    <button
                      className={`${classes.toggleBtn} ${item.available ? classes.toggleOff : classes.toggleOn}`}
                      onClick={() => toggleAvailable(item)}
                      disabled={saving[item.itemId]}
                    >
                      {saving[item.itemId] ? "..." : (item.available ? "Tắt" : "Bật")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={classes.legend}>
        <div><strong>Tồn kho = -1</strong>: Không giới hạn (∞)</div>
        <div><strong>Tồn kho = 0</strong>: Tự động tắt món</div>
        <div>Nhấn Enter hoặc click ra ngoài để lưu thay đổi tồn kho / giá</div>
      </div>
    </div>
  );
};

export default SellerInventory;
