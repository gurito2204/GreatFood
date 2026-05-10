import React, { useEffect, useState } from "react";
import classes from "./Search.module.css";
import SearchBox from "./SearchBox/SearchBox";
import SearchItems from "./SearchItems/SearchItems";
import SearchAfterClickItems from "./SearchAfterClick/SearchAfterClickItems/SearchAfterClickItems";
import useCategoryWiseFood from "../hook/useCategoryWiseFood";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const Search = () => {
  const { CategoryWiseFoodData } = useCategoryWiseFood();
  const { fetchPincode } = useLocationLocalStorage();
  const [data, setData] = useState([]);
  useEffect(() => {
    const CategoryWiseFoodDataFunction = async () => {
      const pincode = fetchPincode();
      const dataCategoryWiseFood = await CategoryWiseFoodData(pincode);
      setData(dataCategoryWiseFood);
    };
    CategoryWiseFoodDataFunction();
  }, []);
  const [search, setSearch] = useState("");
  const [clickSearch, setClickSearch] = useState(false);
  const setSearchValue = (data) => {
    setSearch(data);
    setClickSearch(false);
  };
  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        setClickSearch(true);
      }
    });
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <SearchBox setSearch={setSearchValue} />
        {!clickSearch && <SearchItems search={search} />}
        {clickSearch && <SearchAfterClickItems search={search} data={data} />}
      </div>
    </div>
  );
};

export default Search;
