import React, { useState, useEffect } from 'react'
import styles from "../NavBar/NavBar.module.css"
import "../NavBar/Nav.css"
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    const syncAuth = () => {
      setRole(localStorage.getItem("role"))
      setIsLoggedIn(!!localStorage.getItem("token"))
    }

    // login/logout aana odane fire aagum custom event
    window.addEventListener("authChange", syncAuth)

    // (bonus) vera tab la login/logout pannalum sync aagum
    window.addEventListener("storage", syncAuth)

    return () => {
      window.removeEventListener("authChange", syncAuth)
      window.removeEventListener("storage", syncAuth)
    }
  }, [])

  const openMenu = () => setOpen(!open)
  const closeMenu = () => setOpen(false)

  const isAdmin = role === "admin"

  return (
    <div className={styles.navContainer}>
      <div className={styles.navBrandContainer}>
        <Link to="/" onClick={closeMenu} className={styles.navBrandLink}>
          <span className={styles.navBink}>BINK</span>
          <span className={styles.navPublisher}>PUBLISHERS</span>
        </Link>
      </div>

      <div className={styles.navIcons} onClick={openMenu}>
        {open ? <VscChromeClose size={40} /> : <IoMenu size={40} />}
      </div>

      <ul className={open ? "navUl active" : "navUl"}>
        <li><Link to="/bookstore" onClick={closeMenu} className={styles.navItem}>Bookstore</Link></li>
        <li><Link to="/about" onClick={closeMenu} className={styles.navItem}>About</Link></li>
        <li><Link to="/event" onClick={closeMenu} className={styles.navItem}>Events</Link></li>
        <li><Link to="/contact" onClick={closeMenu} className={styles.navItem}>Contact</Link></li>

        {/* role admin ah irundha mattum idhu show aagum */}
        {isAdmin && (
          <li>
            <Link to="/admin/dashboard" onClick={closeMenu} className={styles.navItem}>
              Admin
            </Link>
          </li>
        )}

        <li>
          <Link to="/login" onClick={closeMenu} className={styles.navItem}>
            <button className={styles.userBtn}>
              <FaUserCircle size={25} />
            </button>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavBar