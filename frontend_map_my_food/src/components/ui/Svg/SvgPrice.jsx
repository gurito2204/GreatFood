import React from "react";

const SvgPrice = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <circle
        cx="9"
        cy="9"
        r="8.25"
        stroke="#3E4152"
        strokeWidth="1.5"
      ></circle>
      <text
        x="9"
        y="13"
        fontSize="12"
        fontFamily="sans-serif"
        fill="#3E4152"
        textAnchor="middle"
        fontWeight="bold"
      >đ</text>
    </svg>
  );
};

export default SvgPrice;
