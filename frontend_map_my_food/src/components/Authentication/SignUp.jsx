import React, { useState, useContext } from "react";
import classes from "./Auth.module.css";
import Svgcross from "../ui/Svg/Svgcross";
import AuthenticationContext from "../store/authentication/Authentication-context";
import useAuth from "../hook/useAuth";

const SignUP = () => {
  const { Auth } = useAuth();
  const AuthenticationCtx = useContext(AuthenticationContext);
  const [values, setValues] = useState({
    phone: "",
    name: "",
    email: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState({});
  const [referral, setReferral] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }
    if (!values.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    }
    if (!values.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const CONTINUE_submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await Auth(
      { number: values.phone, name: values.name, email: values.email },
      "signup"
    );
    if (response == "true") {
      AuthenticationCtx.setDetails(
        values.phone,
        values.name,
        values.email,
        values.referralCode
      );
      setValues({ phone: "", name: "", email: "", referralCode: "" });
      setErrors({});
      AuthenticationCtx.onShow("VerifyOpen");
    }
  };

  const hideHandler = () => {
    AuthenticationCtx.onHide("signupOpen");
  };

  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <div
          className={classes.close}
          onClick={() => {
            hideHandler();
          }}
        >
          <Svgcross />
        </div>
        <div className={classes.part1}>
          <div className={classes.part1_left}>
            <h1>Đăng ký</h1>
            <p
              onClick={() => {
                AuthenticationCtx.onShow("LogInOpen");
              }}
            >
              <span>hoặc</span> đăng nhập tài khoản
            </p>
            <div className={classes.underline}> </div>
          </div>
          <div className={classes.part1_right}>
            <img src="/greatfood/Auth/login.webp" alt="" />
          </div>
        </div>
        <div className={classes.form}>
          <div className={classes.fieldGroup}>
            <input
              type="text"
              placeholder="Họ và tên *"
              value={values.name}
              onChange={handleChange("name")}
              className={errors.name ? classes.inputError : ""}
            />
            {errors.name && <div className={classes.errorText}>{errors.name}</div>}
          </div>
          <div className={classes.fieldGroup}>
            <input
              type="tel"
              placeholder="Số điện thoại *"
              value={values.phone}
              onChange={handleChange("phone")}
              className={errors.phone ? classes.inputError : ""}
            />
            {errors.phone && <div className={classes.errorText}>{errors.phone}</div>}
          </div>
          <div className={classes.fieldGroup}>
            <input
              type="email"
              placeholder="Email *"
              value={values.email}
              onChange={handleChange("email")}
              className={errors.email ? classes.inputError : ""}
            />
            {errors.email && <div className={classes.errorText}>{errors.email}</div>}
          </div>
          {referral && (
            <div className={classes.fieldGroup}>
              <input
                type="text"
                placeholder="Mã giới thiệu"
                value={values.referralCode}
                onChange={handleChange("referralCode")}
              />
            </div>
          )}
        </div>
        {!referral && (
          <div
            className={classes.referral}
            onClick={() => {
              setReferral(true);
            }}
          >
            Có mã giới thiệu?
          </div>
        )}
        <div
          className={classes.continue}
          onClick={(e) => {
            CONTINUE_submit(e);
          }}
        >
          <a>ĐĂNG KÝ</a>
        </div>
        <div className={classes.privacy_policy}>
          Bằng việc tạo tài khoản, tôi đồng ý với Điều khoản sử dụng &
          Chính sách bảo mật
        </div>
      </div>
    </div>
  );
};

export default SignUP;
