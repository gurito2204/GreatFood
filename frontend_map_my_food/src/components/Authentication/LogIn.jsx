import React, { useState, useContext } from "react";
import classes from "./Auth.module.css";
import Svgcross from "../ui/Svg/Svgcross";
import AuthenticationContext from "../store/authentication/Authentication-context";
import useAuth from "../hook/useAuth";

const LogIn = () => {
  const { Auth } = useAuth();
  const AuthenticationCtx = useContext(AuthenticationContext);
  const [values, setValues] = useState({
    number: "",
  });
  const [error, setError] = useState("");

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
    if (error) setError("");
  };

  const validate = () => {
    if (!values.number.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await Auth({ number: values.number }, "signin");
    if (response == "true") {
      AuthenticationCtx.setDetails(values.number, "", "", "");
      setValues({ number: "" });
      setError("");
      AuthenticationCtx.onShow("VerifyOpen");
    }
  };

  const hideHandler = () => {
    AuthenticationCtx.onHide("LogInOpen");
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
            <h1>Đăng nhập</h1>
            <p
              onClick={() => {
                AuthenticationCtx.onShow("signupOpen");
              }}
            >
              <span>hoặc</span> tạo tài khoản mới
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
              type="tel"
              placeholder="Số điện thoại *"
              value={values.number}
              onChange={handleChange("number")}
              className={error ? classes.inputError : ""}
            />
            {error && <div className={classes.errorText}>{error}</div>}
          </div>
        </div>
        <div className={classes.continue} onClick={submit}>
          <a>ĐĂNG NHẬP</a>
        </div>
        <div className={classes.privacy_policy}>
          Bằng việc đăng nhập, tôi đồng ý với Điều khoản sử dụng &
          Chính sách bảo mật
        </div>
      </div>
    </div>
  );
};

export default LogIn;
