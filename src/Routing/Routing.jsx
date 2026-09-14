import { Routes, Route } from "react-router-dom";
import NavBar from "../User/Components/NavBar/NavBar";
import ScrollToTop from "./ScrollToTop";

import Home from "../User/UserPages/Home/Home";
import Bookstore from "../User/UserPages/BookStore/Bookstore";
import About from "../User/UserPages/About/About";
import Contact from "../User/UserPages/Contact/Contact";
import Login from "../User/UserPages/Login/Login";
import Checkout from "../User/UserPages/checkOut/CheckOut"; 

import AdminLayout from "../Admin/Layout/AdminLayout";
import DhashBoard from "../Admin/Pages/DhashBoard/DhashBoard";
import AllProducts from "../Admin/Pages/Products/AllProducts/Allproducts";
import CreateProducts from "../Admin/Pages/Products/CreateProducts/CreateProducts";
import Order from "../Admin/Pages/Orders/Order";
import UserDetails from "../Admin/Pages/Users/UserDetails";
import ContactDetails from "../Admin/Pages/Contacts/ContactDetails";

const Routing = () => {
  return (
    <>
      <ScrollToTop />
      <NavBar />

      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/bookstore" element={<Bookstore />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DhashBoard />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="products/create" element={<CreateProducts />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<UserDetails />} />
          <Route path="contacts" element={<ContactDetails />} />
        </Route>
      </Routes>
    </>
  );
};

export default Routing;