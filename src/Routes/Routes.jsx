import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Components
import SignIn from "../Components/CreateUser/SignIn/SignIn";
import Register from "../Components/CreateUser/SignUp/SignUp";
import WishList from "../Components/Products/WishList/WishList";
import Cart from "../Components/Products/Cart/Cart";
import ItemsDetails from "../Components/Products/ItemsDetails/ItemsDetails";
import Payment from "../Components/Payment/Pyament";

// User Settings Components
import Setting from "../Components/UserSetting/Setting/Setting";
import UserProfile from "../Components/UserSetting/UserProfile/UserProfile";
import Returns from "../Components/UserSetting/Returns/Returns";
import MyCollections from "../Components/UserSetting/MyCollections/MyCollections";

// Other Components
import Main from "../Components/Home/main/main";
import Loader from "../Components/Loader/Loader";
import AllProduct from "../Components/FilterProduct/AllProduct/AllProduct";
import DashBoardRoot from "../Components/DashBoard/DashBoardRoot/DashBoardRoot";
import DashBoard from "../Components/DashBoard/Admin/DashBoard/DashBoard";
import AddProducts from "../Components/DashBoard/AddProducts/AddProducts";
import ManageProduct from "../Components/DashBoard/Admin/ManageProduct/ManageProduct";
import UserControl from "../Components/DashBoard/Admin/UserControll/UserControll";
import Replay from "../Components/ChatBox/Replay/Replay";
import TopSeller from "../Components/DashBoard/Admin/UserControll/TopSeller/TopSeller";
import CashOnDelivery from "../Components/DashBoard/Seller/ManageItems/CashOnDelivery/CashOnDelivery";
import PaymentUsers from "../Components/DashBoard/Seller/ManageItems/paymentUsers/PaymentUsers";
import SellerProduct from "../Components/DashBoard/Seller/ManageItems/SellerProduts/SellerProduct";
import SellingChart from "../Components/DashBoard/Seller/SellingChart/SellingChat";
import UserOrder from "../Components/CreateUser/UserOrder/UserOrder";
import CouponOffer from "../Components/DashBoard/Admin/CouponOffer/CouponOffer";
import FlashSellTime from "../Components/DashBoard/Admin/FlashSellTime/FlashSellTime";
import AboutUs from "../Components/Design/AboutUs/AboutUs";
import Contact from "../Components/Design/Contact/Contact";

// Lazy-loaded Components
const Root = lazy(() => import("../Root/Root"));
// Define Route Paths as Constants
const ROUTES = {
  HOME: "/",
  SIGN_UP: "/signin",
  SIGN_IN: "/signup",
  WISH_LIST: "/wishlist",
  USERORDER: '/myOrder',
  CART: "/cart",
  ITEM_DETAILS: "/itemsdetails/:id",
  ORDER: "/order",
  ORDERs: "/order/:id",
  SETTINGS: "/setting",
  PROFILE: "myProfile",
  RETURNS: "returns",
  COLLECTIONS: "myCollections",
  AllPRODUCTS: '/allProduct',
  DASHBOARD: '/dashboard',
  ABOUTUS:'/aboutUs',
  CONTACT:'/contact',
  //admin
  DASHBOARDPANEL: '/dashboard/admin/panelDashboard',
  ADDPRODUCTS: '/dashboard/addProducts', //both can access seller and admin
  MANAGEPRODUCTS: '/dashboard/admin/manageProducts',
  MANAGEUSERS: '/dashboard/admin/manageUsers',
  REPLAY: '/dashboard/admin/messages/:chatId',
  TOPSELLER: '/dashboard/admin/topSeller',
  COUPON:'/dashboard/admin/coupon',
  FLASHSELLOFFER:'/dashboard/admin/flashSell',
  // seller
  CASHONDELIVERY: '/dashboard/seller/CashOnDelivery',
  PAYMENTUSERS: '/dashboard/seller/paymentUser',
  SELLERPRODUTS: '/dashboard/seller/sellerProducts',
  SELLERPANEL: '/dashboard/seller/SellerPanel'
}
// Define Routes
export const Routes = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<Loader />}>
        <Root />
      </Suspense>
    ),
    children: [
      { path: ROUTES.HOME, element: <Main /> },
      { path: ROUTES.SIGN_UP, element: <Register /> },
      { path: ROUTES.SIGN_IN, element: <SignIn /> },
      { path: ROUTES.WISH_LIST, element: <WishList /> },
      { path: ROUTES.CART, element: <Cart /> },
      { path: ROUTES.ITEM_DETAILS, element: <ItemsDetails /> },
      { path: ROUTES.ORDER, element: <Payment /> },
      { path: ROUTES.ORDERs, element: <Payment /> },
      {
        path: ROUTES.AllPRODUCTS,
        element: (
          <Suspense fallback={<Loader />}>
            <AllProduct />
          </Suspense>
        ),
      },
      { path: ROUTES.USERORDER, element: <UserOrder /> },
      {path:ROUTES.ABOUTUS,element:<AboutUs/>},
      {path:ROUTES.CONTACT,element:<Contact/>},
      //for admin
      {
        path: ROUTES.DASHBOARD, element: <DashBoardRoot />,
        children: [
          { path: ROUTES.DASHBOARDPANEL, element: <DashBoard /> },
          { path: ROUTES.ADDPRODUCTS, element: <AddProducts /> },
          { path: ROUTES.MANAGEPRODUCTS, element: <ManageProduct /> },
          { path: ROUTES.MANAGEUSERS, element: <UserControl /> },  // ADD THIS LINE TO ADD A NEW PATH FOR MANAGE USERS IN ADMIN PANEL
          { path: ROUTES.REPLAY, element: <Replay /> },  // ADD THIS LINE TO ADD A NEW PATH FOR CHAT IN ADMIN PANEL
          { path: ROUTES.TOPSELLER, element: <TopSeller /> },
          { path: ROUTES.CASHONDELIVERY, element: <CashOnDelivery /> },
          { path: ROUTES.PAYMENTUSERS, element: <PaymentUsers /> },
          { path: ROUTES.SELLERPRODUTS, element: <SellerProduct /> },
          { path: ROUTES.SELLERPANEL, element: <SellingChart /> },
          { path: ROUTES.COUPON, element: <CouponOffer /> }, // for admin
          { path: ROUTES.FLASHSELLOFFER, element: <FlashSellTime /> }, // for admin


        ]
      },
      //for seller
      {
        path: ROUTES.SETTINGS, element: <Setting />,
        children: [
          { path: ROUTES.PROFILE, element: <UserProfile /> },
          { path: ROUTES.RETURNS, element: <Returns /> },
          { path: ROUTES.COLLECTIONS, element: <MyCollections /> },
        ],
      },


    ],
  }
]);
