import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUsers, FaUserCheck, FaUserSlash, FaEllipsisV, FaEdit, FaTrash, FaLock, FaLockOpen } from "react-icons/fa";
import "./UserDetails.css";

const UserDetails = () => {

  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: ""
  });

  const [editUserId, setEditUserId] = useState(null);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3004/user/get");
      setUsers(res.data.data);
      setFilterUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();

    const filtered = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchText)) ||
      (user.email && user.email.toLowerCase().includes(searchText)) ||
      (user.role && user.role.toLowerCase().includes(searchText))
    );

    setFilterUsers(filtered);
  };

  const handleEdit = (user) => {
    setUserData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditUserId(user._id);
    setIsModelOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:3004/user/update", {
        _id: editUserId,
        role: userData.role
      });
      closeModel();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    try {
      await axios.put("http://localhost:3004/user/delete", { _id: id });
      setOpenDropdownId(null);
      getAllUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      await axios.put("http://localhost:3004/user/update", {
        _id: user._id,
        isBlocked: !user.isBlocked
      });
      setOpenDropdownId(null);
      getAllUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const closeModel = () => {
    setIsModelOpen(false);
    setEditUserId(null);
    getAllUsers();
  };

  const handleData = (e) => {
    setUserData({ ...userData, role: e.target.value });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  const getAvatarColor = (seed) => {
    const colors = ["#EAD9FF", "#C9E9FF", "#FFE1C4", "#D3F3DA", "#FFD6E0", "#D8E2FF"];
    if (!seed) return colors[0];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const totalUsers = filterUsers.length;
  const blockedUsers = filterUsers.filter(u => u.isBlocked).length;
  const activeUsers = totalUsers - blockedUsers;

  return (
    <div className="user-details-page">
      <div className="udp-outer-card">

        <div className="udp-top-row">
          <h4 className="udp-title">Users</h4>
          <input
            type="search"
            className="udp-search-input"
            placeholder="Search users"
            onChange={handleSearch}
          />
        </div>

        {/* stats */}
        <div className="udp-stats-row">
          <div className="udp-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-warning">
                <FaUsers />
              </div>
              <div>
                <h5 className="udp-stat-value">{totalUsers}</h5>
                <small className="udp-muted">Total Users</small>
              </div>
            </div>
          </div>

          <div className="udp-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                <FaUserCheck />
              </div>
              <div>
                <h5 className="udp-stat-value">{activeUsers}</h5>
                <small className="udp-muted">Active Users</small>
              </div>
            </div>
          </div>

          <div className="udp-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-danger">
                <FaUserSlash />
              </div>
              <div>
                <h5 className="udp-stat-value">{blockedUsers}</h5>
                <small className="udp-muted">Blocked Users</small>
              </div>
            </div>
          </div>
        </div>

        {/* list header */}
        <div className="udp-list-header">
          <span className="udp-col udp-col-user">User</span>
          <span className="udp-col udp-col-email">Email</span>
          <span className="udp-col udp-col-role">Role</span>
          <span className="udp-col udp-col-status">Status</span>
          <span className="udp-col udp-col-edit">Edit</span>
          <span className="udp-col udp-col-action">Actions</span>
        </div>

        {/* rows */}
        <div className="udp-rows">
          {filterUsers.map((user) => (
            <div className="udp-row" key={user._id}>

              <div className="udp-col udp-col-user">
                <div className="udp-profile-cell">
                  <div
                    className="avatar"
                    style={{ background: getAvatarColor(user.name || user._id) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="udp-user-text">
                    <span className="udp-user-name">{user.name}</span>
                    <span className="udp-user-handle">@{(user.name || "user").toLowerCase().replace(/\s+/g, "")}</span>
                  </div>
                </div>
              </div>

              <div className="udp-col udp-col-email">
                <span className="udp-email-text">{user.email}</span>
              </div>

              <div className="udp-col udp-col-role">
                <span className={`udp-badge ${user.role === "admin" ? "udp-badge-primary" : "udp-badge-secondary"}`}>
                  {user.role}
                </span>
              </div>

              <div className="udp-col udp-col-status">
                <span className={`udp-status ${user.isBlocked ? "udp-status-blocked" : "udp-status-active"}`}>
                  <span className="udp-status-dot"></span>
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="udp-col udp-col-edit">
                <button className="udp-edit-btn" onClick={() => handleEdit(user)}>
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>

              <div className="udp-col udp-col-action">
                <div
                  className="udp-dropdown"
                  ref={openDropdownId === user._id ? dropdownRef : null}
                >
                  <button
                    className="udp-btn-icon-plain"
                    onClick={() => toggleDropdown(user._id)}
                  >
                    <FaEllipsisV />
                  </button>

                  {openDropdownId === user._id && (
                    <ul className="udp-dropdown-menu">
                      <li>
                        <button className="udp-dropdown-item" onClick={() => handleBlockToggle(user)}>
                          {user.isBlocked ? <FaLockOpen className="udp-icon-gap" /> : <FaLock className="udp-icon-gap" />}
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </li>
                      <li>
                        <button className="udp-dropdown-item udp-dropdown-item-danger" onClick={() => handleDelete(user._id)}>
                          <FaTrash className="udp-icon-gap" />
                          Delete
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

            </div>
          ))}

          {filterUsers.length === 0 && (
            <div className="udp-empty-row">No users found</div>
          )}
        </div>
      </div>

      {/* edit role modal */}
      {isModelOpen && (
        <div className="model">
          <div className="model-content">

            <span className="close" onClick={closeModel}>
              &times;
            </span>

            <h5 className="udp-modal-title">Edit User Role</h5>

            <div className="udp-form-group">
              <label className="udp-form-label">Name</label>
              <input type="text" className="udp-form-control" value={userData.name} disabled />
            </div>

            <div className="udp-form-group">
              <label className="udp-form-label">Email</label>
              <input type="text" className="udp-form-control" value={userData.email} disabled />
            </div>

            <div className="udp-form-group">
              <label className="udp-form-label">Role</label>
              <select className="udp-form-select" value={userData.role} onChange={handleData}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="udp-btn udp-btn-success" onClick={handleUpdate}>
              Update Role
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserDetails;