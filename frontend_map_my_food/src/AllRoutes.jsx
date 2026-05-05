import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Offers from "./components/Offers/Offers";
import Support from "./components/Support/Support";
import Cart from "./components/Cart/Cart";
import Search from "./components/Search/Search";
import SearchRestaurants from "./components/Search/SearchRestaurants/SearchRestaurants";
import User from "./components/User/User";
import NewRestaurant from "./components/NewRestaurant/NewRestaurant";
import PrivateRoute from "./PrivateRoutes";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import SellerLayout from "./components/SellerDashboard/SellerLayout";
import SellerDashboard from "./components/SellerDashboard/SellerDashboard";
import SellerSubscription from "./components/SellerDashboard/SellerSubscription";
import SellerInbox from "./components/SellerDashboard/SellerInbox";
import SellerOrders from "./components/SellerDashboard/SellerOrders";
import SellerInventory from "./components/SellerDashboard/SellerInventory";
import SellerSettings from "./components/SellerDashboard/SellerSettings";

// Seller routes sử dụng SellerLayout chung
const sellerRoutes = [
  { path: "/seller/dashboard",    Component: SellerDashboard },
  { path: "/seller/subscription", Component: SellerSubscription },
  { path: "/seller/inbox",        Component: SellerInbox },
  { path: "/seller/orders",       Component: SellerOrders },
  { path: "/seller/inventory",    Component: SellerInventory },
  { path: "/seller/settings",     Component: SellerSettings },
];

// Public & other private routes
const otherRoutes = [
  { path: "/", Component: HomePage, exact: true },
  { path: "/offers/:page", Component: Offers },
  { path: "/supports", Component: Support },
  { path: "/support/issues/:page", Component: Support },
  { path: "/checkout", Component: Cart },
  { path: "/search", Component: Search },
  { path: "/search/:RestaurantId", Component: SearchRestaurants },
  { path: "/my-account/:page", Component: User, private: true },
  { path: "/new-restaurant", Component: NewRestaurant, private: true },
  { path: "*", Component: PageNotFound },
];

export const AllRoutes = ({ islogIn }) => (
  <Routes>
    {/* Seller routes: wrapped in SellerLayout */}
    {sellerRoutes.map((route, index) => (
      <Route
        key={`seller-${index}`}
        path={route.path}
        element={
          <PrivateRoute
            islogIn={islogIn}
            Component={() => (
              <SellerLayout>
                <route.Component />
              </SellerLayout>
            )}
          />
        }
      />
    ))}

    {/* Other routes */}
    {otherRoutes.map((route, index) => (
      <Route
        key={`other-${index}`}
        path={route.path}
        exact={route.exact}
        element={
          route.private ? (
            <PrivateRoute islogIn={islogIn} Component={route.Component} />
          ) : (
            <route.Component />
          )
        }
      />
    ))}
  </Routes>
);
