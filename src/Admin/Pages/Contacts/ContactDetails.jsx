import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaReply,
  FaEllipsisV,
  FaEye,
  FaTrash,
  FaTimes,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import "./ContactDetails.css";

const ContactDetails = () => {

  const [contacts, setContacts] = useState([]);
  const [filterContacts, setFilterContacts] = useState([]);

  const [selectedContact, setSelectedContact] = useState(null);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const getAllContacts = async () => {
    try {
      const res = await axios.get("http://localhost:3004/contact/get");
      setContacts(res.data.data);
      setFilterContacts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllContacts();
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

    const filtered = contacts.filter(contact =>
      (contact.name && contact.name.toLowerCase().includes(searchText)) ||
      (contact.email && contact.email.toLowerCase().includes(searchText)) ||
      (contact.mobileNo && contact.mobileNo.toLowerCase().includes(searchText))
    );

    setFilterContacts(filtered);
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
  };

  const closeViewModal = () => {
    setSelectedContact(null);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this message?");
    if (!isConfirmed) return;

    try {
      await axios.put("http://localhost:3004/contact/delete", { _id: id });
      setOpenDropdownId(null);
      getAllContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const handleMarkRead = async (contact) => {
    try {
      await axios.put("http://localhost:3004/contact/update", {
        _id: contact._id,
        status: "Read",
      });
      getAllContacts();
      closeViewModal();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusKey = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "read") return "read";
    if (s === "replied") return "replied";
    return "pending";
  };

  const statusLabel = (status) => {
    const key = getStatusKey(status);
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatDate = (value) => {
    if (!value) return { date: "-", time: "" };
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return { date: "-", time: "" };
    const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return { date, time };
  };

  const totalMessages = filterContacts.length;
  const pendingCount = filterContacts.filter(c => getStatusKey(c.status) === "pending").length;
  const readCount = filterContacts.filter(c => getStatusKey(c.status) === "read").length;
  const repliedCount = filterContacts.filter(c => getStatusKey(c.status) === "replied").length;

  return (
    <div className="cd-page">
      <div className="cd-outer-card">

        <div className="cd-top-row">
          <h4 className="cd-title">Contact Details</h4>
          <input
            type="search"
            className="cd-search-input"
            placeholder="Search by name, email or mobile..."
            onChange={handleSearch}
          />
        </div>

        {/* stats */}
        <div className="cd-stats-row">
          <div className="cd-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-info">
                <FaEnvelope />
              </div>
              <div>
                <h5 className="cd-stat-value">{totalMessages}</h5>
                <small className="cd-muted">Total Messages</small>
              </div>
            </div>
          </div>

          <div className="cd-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-warning">
                <FaClock />
              </div>
              <div>
                <h5 className="cd-stat-value">{pendingCount}</h5>
                <small className="cd-muted">Pending</small>
              </div>
            </div>
          </div>

          <div className="cd-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-success">
                <FaCheckCircle />
              </div>
              <div>
                <h5 className="cd-stat-value">{readCount}</h5>
                <small className="cd-muted">Read</small>
              </div>
            </div>
          </div>

          <div className="cd-stat-col">
            <div className="stat-card">
              <div className="stat-icon stat-icon-primary">
                <FaReply />
              </div>
              <div>
                <h5 className="cd-stat-value">{repliedCount}</h5>
                <small className="cd-muted">Replied</small>
              </div>
            </div>
          </div>
        </div>

        {/* list header */}
        <div className="cd-list-header">
          <span className="cd-col cd-col-sno">S.No</span>
          <span className="cd-col cd-col-name">Name</span>
          <span className="cd-col cd-col-mobile">Mobile No</span>
          <span className="cd-col cd-col-email">Email</span>
          <span className="cd-col cd-col-status">Status</span>
          <span className="cd-col cd-col-message">Message</span>
          <span className="cd-col cd-col-date">Date</span>
          <span className="cd-col cd-col-action">Action</span>
        </div>

        {/* rows */}
        <div className="cd-rows">
          {filterContacts.map((contact, index) => {
            const { date, time } = formatDate(contact.createdAt || contact.date);
            const statusKey = getStatusKey(contact.status);

            return (
              <div className="cd-row" key={contact._id}>

                <div className="cd-col cd-col-sno" data-label="S.No">
                  <span className="cd-sno-text">{index + 1}</span>
                </div>

                <div className="cd-col cd-col-name" data-label="Name">
                  <span className="cd-user-name">{contact.name}</span>
                </div>

                <div className="cd-col cd-col-mobile" data-label="Mobile No">
                  <span className="cd-mobile-text">{contact.mobileNo}</span>
                </div>

                <div className="cd-col cd-col-email" data-label="Email">
                  <span className="cd-email-text">{contact.email}</span>
                </div>

                <div className="cd-col cd-col-status" data-label="Status">
                  <span className={`cd-status cd-status-${statusKey}`}>
                    <span className="cd-status-dot"></span>
                    {statusLabel(contact.status)}
                  </span>
                </div>

                <div className="cd-col cd-col-message" data-label="Message">
                  <span className="cd-message-text" title={contact.message}>
                    {contact.message}
                  </span>
                </div>

                <div className="cd-col cd-col-date" data-label="Date">
                  <div className="cd-date-cell">
                    <span className="cd-date-text">{date}</span>
                    <span className="cd-time-text">{time}</span>
                  </div>
                </div>

                <div className="cd-col cd-col-action" data-label="Action">
                  <button className="cd-view-btn" onClick={() => handleView(contact)}>
                    <FaEye />
                    <span>View</span>
                  </button>

                  <div
                    className="cd-dropdown"
                    ref={openDropdownId === contact._id ? dropdownRef : null}
                  >
                    <button
                      className="cd-btn-icon-plain"
                      onClick={() => toggleDropdown(contact._id)}
                    >
                      <FaEllipsisV />
                    </button>

                    {openDropdownId === contact._id && (
                      <ul className="cd-dropdown-menu">
                        <li>
                          <button
                            className="cd-dropdown-item cd-dropdown-item-danger"
                            onClick={() => handleDelete(contact._id)}
                          >
                            <FaTrash className="cd-icon-gap" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {filterContacts.length === 0 && (
            <div className="cd-empty-row">No messages found</div>
          )}
        </div>
      </div>

      {/* view details modal */}
      {selectedContact && (
        <div className="cd-modal-backdrop">
          <div className="cd-modal-content">

            <h5 className="cd-modal-title">Contact Details</h5>

            <div className="cd-view-field">
              <label className="cd-view-label">Name</label>
              <div className="cd-view-box">{selectedContact.name}</div>
            </div>

            <div className="cd-view-field">
              <label className="cd-view-label">Mobile No</label>
              <div className="cd-view-box">{selectedContact.mobileNo}</div>
            </div>

            <div className="cd-view-field">
              <label className="cd-view-label">Email</label>
              <div className="cd-view-box">{selectedContact.email}</div>
            </div>

            <div className="cd-view-field">
              <label className="cd-view-label">Status</label>
              <div className="cd-view-box cd-view-box-status">
                <span className={`cd-status cd-status-${getStatusKey(selectedContact.status)}`}>
                  <span className="cd-status-dot"></span>
                  {statusLabel(selectedContact.status)}
                </span>
              </div>
            </div>

            <div className="cd-view-field">
              <label className="cd-view-label">Message</label>
              <div className="cd-view-box cd-view-box-message">{selectedContact.message}</div>
            </div>

            <div className="cd-view-field">
              <label className="cd-view-label">Date</label>
              <div className="cd-view-box">
                {formatDate(selectedContact.createdAt || selectedContact.date).date}
                {"  "}
                {formatDate(selectedContact.createdAt || selectedContact.date).time}
              </div>
            </div>

            <div className="cd-modal-actions">
              <button className="cd-btn cd-btn-outline" onClick={closeViewModal}>
                <FaTimes className="cd-icon-gap" />
                Close
              </button>
              <button
                className="cd-btn cd-btn-success"
                onClick={() => handleMarkRead(selectedContact)}
                disabled={getStatusKey(selectedContact.status) !== "pending"}
              >
                <FaEnvelopeOpenText className="cd-icon-gap" />
                Read
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ContactDetails;