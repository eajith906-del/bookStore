import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaEnvelope } from "react-icons/fa";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-sidebar">
      <h5 className="text-center py-3 border-bottom">Admin Panel</h5>

      <ul className="nav flex-column">

        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/dashboard">
            <FaTachometerAlt /> Dashboard
          </NavLink>
        </li>

        {/* PRODUCTS DROPDOWN */}
        <li className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={() => setOpen(!open)}>
            <FaBox /> Products
          </div>

          {open && (
            <ul className="sub-menu">
              <li>
                <NavLink to="/admin/products" className="nav-link">
                  All Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/products/create" className="nav-link">
                  Create Product
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/orders">
            <FaShoppingCart /> Orders
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/users">
            <FaUsers /> Users
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/contacts">
            <FaEnvelope /> Contacts
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
