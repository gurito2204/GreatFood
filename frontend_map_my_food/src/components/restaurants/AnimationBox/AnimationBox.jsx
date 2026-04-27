import React, { useState } from "react";
import classes from "./AnimationBox.module.css";

const AnimationBox = () => {
  const [cards] = useState(8);

  return (
    <div className={classes.container}>
      {Array(cards)
        .fill()
        .map((_, index) => (
          <div className={classes.skeleton_card} key={index}>
            <div className={`${classes.skeleton_image} ${classes.animated_bg}`}></div>
            <div className={classes.skeleton_body}>
              <div className={`${classes.skeleton_title} ${classes.animated_bg}`}></div>
              <div className={`${classes.skeleton_subtitle} ${classes.animated_bg}`}></div>
            </div>
            <div className={classes.skeleton_footer}>
              <div className={`${classes.skeleton_badge} ${classes.animated_bg}`}></div>
              <div className={`${classes.skeleton_time} ${classes.animated_bg}`}></div>
              <div className={`${classes.skeleton_cost} ${classes.animated_bg}`}></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnimationBox;
