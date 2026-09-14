import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import "./adminLayout.css";

const AdminLayout = () => {
  return (
    <div className="container-fluid admin-wrapper">
      <div className="row">

        {/* SIDEBAR */}
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* CONTENT */}
        <div className="col-12 col-md-9 col-lg-10 p-4 admin-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;
