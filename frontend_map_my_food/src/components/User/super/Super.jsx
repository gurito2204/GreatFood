import React from "react";
import classes from "./Super.module.css";

const Super = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <h1>GreatFood</h1>
        <p>Get free delivery and extra discounts all across GreatFood.</p>
        <p>
          Your Swiggy One benefits can be availed only on the GreatFood App.
        </p>
        <div className={classes.images}>
          <div className={classes.image}>
            <img src="/greatfood/Logo/appStore.png" alt="" />
          </div>
          <div className={classes.image}>
            <img src="/greatfood/Logo/googlePlay.png" alt="" />
          </div>
        </div>
      </div>
      <div className={classes.right}>
        <img src="/greatfood/User/my_account_supe.webp" alt="" />
      </div>
    </div>
  );
};

export default Super;
