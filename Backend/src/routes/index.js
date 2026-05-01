const getPaymentOffersRoute = require("./PaymentOffers/getPaymentOffersRoute");
const getSearchRoute = require("./search/getSearchRoute");
const getRestaurantRoute = require("./Restaurant/getRestaurantRoute");
const insertRestaurantRoute = require("./Restaurant/insertRestaurantRoute");
const insertRestaurantOffersRoute = require("./RestaurantOffers/insertRestaurantOffersRoute");
const insertRestaurantFoodRoute = require("./RestaurantFood/insertRestaurantFoodRoute");
const getRestaurantFoodRoute = require("./RestaurantFood/getRestaurantFoodRoute");
const getCategoryWiseFoodRoute = require("./CategoryWiseFood/getCategoryWiseFoodRoute");
const getAvailableRestaurantsRoute = require("./AvailableRestaurants/getAvailableRestaurantsRoute");
const getRecipesRoute = require("./Recipes/getRecipesRoute");
const getItemPriceCartRoute = require("./ItemPriceCart/getItemPriceCartRoute");
const getAvailableRestaurantsSortingRoute = require("./AvailableRestaurantsSorting/getAvailableRestaurantsSortingRoute");
const insertSignInRoute = require("./Authentication/insertSignInRoute");
const insertVerifyRoute = require("./Authentication/insertVerifyRoute");
const insertSignUpRoute = require("./Authentication/insertSignUpRoute");
const updateRestaurantOffersRoute = require("./RestaurantOffers/updateRestaurantOffersRoute");
const deleteRestaurantOffersRoute = require("./RestaurantOffers/deleteRestaurantOffersRoute");
const updateRestaurantFoodRoute = require("./RestaurantFood/updateRestaurantFoodRoute");
const deleteRestaurantFoodRoute = require("./RestaurantFood/deleteRestaurantFoodRoute");
const updateRestaurantRoute = require("./Restaurant/updateRestaurantRoute");
const getRestaurantAllOffersRoute = require("./RestaurantOffers/getRestaurantAllOffersRoute");
const getRestaurantAllFoodRoute = require("./RestaurantFood/getRestaurantAllFoodRoute");
const toggleSmsPreferencesRoute = require("./user/toggleSmsPreferencesRoute");
const insertUserAddressesRoute = require("./user/insertUserAddressesRoute");
const getUserAddressesRoute = require("./user/getUserAddressesRoute");
const deleteUserAddressesRoute = require("./user/deleteUserAddressesRoute");
const insertUserOrderRoute = require("./UserOrder/insertUserOrderRoute");
const getUserOrderRoute = require("./UserOrder/getUserOrderRoute");
const updateProfileRoute = require("./user/updateProfileRoute");
const getRatingsRoute = require("./Ratings/getRatingsRoute");
const insertRatingRoute = require("./Ratings/insertRatingRoute");

const getChatHistoryRoute = require("./Chat/getChatHistoryRoute");
const getAnalyticsRoute = require("./Analytics/getAnalyticsRoute");
const getInboxRoute = require("./Chat/getInboxRoute");
const markReadRoute = require("./Chat/markReadRoute");
const getNearbyRestaurantsRoute = require("./NearbyRestaurants/getNearbyRestaurantsRoute");
const getReverseGeocodeRoute = require("./Location/getReverseGeocodeRoute");

module.exports = routes = [
  getPaymentOffersRoute,
  getSearchRoute,
  getRestaurantRoute,
  insertRestaurantRoute,
  insertRestaurantOffersRoute,
  insertRestaurantFoodRoute,
  getRestaurantFoodRoute,
  getCategoryWiseFoodRoute,
  getAvailableRestaurantsRoute,
  getRecipesRoute,
  getItemPriceCartRoute,
  getAvailableRestaurantsSortingRoute,
  insertSignInRoute,
  insertVerifyRoute,
  insertSignUpRoute,
  updateRestaurantOffersRoute,
  deleteRestaurantOffersRoute,
  updateRestaurantFoodRoute,
  deleteRestaurantFoodRoute,
  updateRestaurantRoute,
  getRestaurantAllOffersRoute,
  getRestaurantAllFoodRoute,
  toggleSmsPreferencesRoute,
  insertUserAddressesRoute,
  getUserAddressesRoute,
  deleteUserAddressesRoute,
  insertUserOrderRoute,
  getUserOrderRoute,
  updateProfileRoute,
  getRatingsRoute,
  insertRatingRoute,
  getChatHistoryRoute,
  getAnalyticsRoute,
  getInboxRoute,
  markReadRoute,
  getNearbyRestaurantsRoute,
  getReverseGeocodeRoute,
];
