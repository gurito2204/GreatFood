import React from "react";
import HomeHeader from "./HomeHeader/HomeHeader";
import HomeMiddleTop from "./HomeMiddle/HomeMiddleTop";
import HomeMiddleBottom from "./HomeMiddle/HomeMiddleBottom";
import classes from "./Home.module.css";

const Home = ({ showHeader = true }) => {
  return (
    <div className={classes.box}>
      <div className={classes.home}>
        {showHeader && <HomeHeader />}
        <div className={classes.middle}>
          <HomeMiddleTop />
          <HomeMiddleBottom />
        </div>
      </div>
    </div>
  );
};

export default Home;
