import React, { useState } from "react";
import classes from "./NewRestaurant.module.css";
import Steps from "./Steps/Steps";
import CreateNewRestaurant from "./CreateNewRestaurant/CreateNewRestaurant";

const NewRestaurant = () => {
  const [isShow, setIsShow] = useState(0);
  return (
    <div className={classes.boxes}>
      <div className={classes.inner_box}>
        <div className={classes.steps}>
          <Steps setIsShow={setIsShow} />
        </div>
        <div className={classes.box}>
          {isShow == 0 && <CreateNewRestaurant setIsShow={setIsShow} />}
        </div>
      </div>
    </div>
  );
};

export default NewRestaurant;
