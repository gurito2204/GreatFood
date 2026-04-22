import React from "react";
import classes from "./SearchAfterClickHeader.module.css";

const SearchAfterClickHeader = () => {
  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <button>Restaurants</button>
        <div className={classes.active}>
          <button>Dishes</button>
        </div>
      </div>
      <div className={classes.bottom}>
        <button>Sort by</button>
        <button>Fast Delivery</button>
        <button>Rated 4+</button>
        <button>VND 100 - VND 250</button>
        <button>Less than VND 100</button>
      </div>
    </div>
  );
};

export default SearchAfterClickHeader;
