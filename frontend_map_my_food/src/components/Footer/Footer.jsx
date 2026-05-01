import React from "react";
import classes from "./Footer.module.css";
import company from "../TemporaryData/company.json";
import contact from "../TemporaryData/contact.json";
import legel from "../TemporaryData/legal.json";
const Footer = () => {
  return (
    <div className={classes.box}>
      <div className={classes.top}>
        <div className={classes.part}>
          <h1>Company</h1>
          {company.map((data, index) => {
            return <div key={index}>{data}</div>;
          })}
        </div>
        <div className={classes.part}>
          <h1>Contact</h1>
          {contact.map((data, index) => {
            return <div key={index}>{data}</div>;
          })}
        </div>
        <div className={classes.part}>
          <h1>Legel</h1>
          {legel.map((data, index) => {
            return <div key={index}>{data}</div>;
          })}
        </div>
        <div className={classes.part4}>
          <img src="/greatfood/Logo/googlePlay.png" alt="googlePlay" />
          <img src="/greatfood/Logo/appStore.png" alt="appStore" />
        </div>
      </div>
      <div className={classes.bottom}>
       
        <div className={classes.bottom_last}>
          <div className={classes.part1_img}>
            <img src="/greatfood/Logo/logo_2022.png" alt="logo" />
            <h2>GreatFood</h2>
          </div>
          <div className={classes.part2}>Â© 2023 GreatFood</div>
          <div className={classes.part3}>
            <div>
              <img src="/greatfood/Logo/Footer/facebook.png" alt="" />
            </div>
            <div>
              <img src="/greatfood/Logo/Footer/pinterest.png" alt="" />
            </div>
            <div>
              <img src="/greatfood/Logo/Footer/instagram.png" alt="" />
            </div>
            <div>
              <img src="/greatfood/Logo/Footer/twitter.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
