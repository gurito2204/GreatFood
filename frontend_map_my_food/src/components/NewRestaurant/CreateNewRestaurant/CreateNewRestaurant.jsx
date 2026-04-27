import React, { useState, useEffect } from "react";
import classes from "../Restarurant.module.css";
import Question from "../Question/Question";
import UploadImage from "../UploadImage/UploadImage";
import Curd from "../Crud/Crud";
import useGetFoodsAndOffers from "../../hook/useGetFoodsAndOffers";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";
import ShopLocationPicker from "../ShopLocationPicker/ShopLocationPicker";

const CreateNewRestaurant = () => {
  const { GetFoodsAndOffersData } = useGetFoodsAndOffers();
  const { fetchRestaurantId } = useLocationLocalStorage();
  const [image, setImage] = useState(null);
  const [imageToBackend, setImageToBackend] = useState(null);
  
  // 1. Sắp xếp lại thứ tự hợp logic, gán mặc định rating là "0"
  const [values, setValues] = useState({
    Restaurant: "",
    phone_number: "",
    address: "",
    location: "",
    pincode: "",
    Restaurant_dish: "",
    opening_hours: "",
    time: "",
    price: "",
    FreeDeliveryonOrderDistance: "",
    FreeDeliveryonOrderAbove: "",
    rating: "0",      
    ratingCount: "0", 
  });

  // 2. Tạo từ điển Việt hóa giao diện (UI) thay vì hiện key tiếng Anh
  const labelMapping = {
    Restaurant: "Tên quán / Tên người bán",
    phone_number: "Số điện thoại liên hệ",
    address: "Địa chỉ chi tiết (VD: 123 Lê Lợi, KTX Khu B)",
    location: "Khu vực (VD: TP Thủ Đức, Dĩ An)",
    pincode: "Mã vùng (VD: 700000, 820000)",
    Restaurant_dish: "Chuyên món (VD: Cơm tấm, Trà sữa)",
    opening_hours: "Giờ hoạt động (VD: 08:00 - 22:00)",
    time: "Thời gian chuẩn bị dự kiến (Phút)",
    price: "Khoảng giá trung bình (VD: 20k - 50k)",
    FreeDeliveryonOrderDistance: "Freeship trong bán kính (Km)",
    FreeDeliveryonOrderAbove: "Freeship cho đơn hàng từ (VNĐ)"
  };

  useEffect(() => {
    const fetchdata = async () => {
      const response = await GetFoodsAndOffersData("restaurant");
      const { _id, RestaurantId, ...rest } = response;
      setValues(rest);
      setImage(response.image);
    };
    if (fetchRestaurantId() != undefined) fetchdata();
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}> Đăng ký Bán hàng </div>
      <div className={classes.part1_a}>Ảnh đại diện của Quán/Món ăn</div>
      <div className={classes.part1}>
        {image && (
          <UploadImage
            ids={"CreateNewRestaurant"}
            srcLink={`${import.meta.env.VITE_REACT_BACKEND_URL}${image}`}
            setImageToBackend={setImageToBackend}
          />
        )}
        {!image && (
          <UploadImage
            ids={"CreateNewRestaurant"}
            srcLink={null}
            setImageToBackend={setImageToBackend}
          />
        )}
        <div className={classes.curd}>
          <Curd
            page={"restaurant"}
            data={values}
            id={fetchRestaurantId()}
            imageToBackend={imageToBackend}
          />
        </div>
      </div>
      <div className={classes.allquestion}>
        {/* ShopLocationPicker thay thế 3 trường: address, location, pincode */}
        <ShopLocationPicker
          onChange={(locationData) => {
            setValues((prev) => ({
              ...prev,
              address: locationData.address || prev.address,
              location: locationData.location || prev.location,
              pincode: locationData.pincode || prev.pincode,
              ...(locationData.lat != null ? { lat: locationData.lat } : {}),
              ...(locationData.lng != null ? { lng: locationData.lng } : {}),
            }));
          }}
        />
        {Object.entries(values)
          // Lọc bỏ các trường không cho người dùng tự nhập + các trường đã có ShopLocationPicker lo
          .filter(([question]) =>
            question !== "image" &&
            question !== "rating" &&
            question !== "ratingCount" &&
            question !== "address" &&
            question !== "location" &&
            question !== "pincode"
          )
          .map(([question, value]) => (
            <Question
              key={question}
              value={value}
              question={labelMapping[question] || question}
              handleChange={handleChange(question)}
            />
        ))}
      </div>
    </div>
  );
};

export default CreateNewRestaurant;