import React from 'react'
import { useState, useRef } from 'react';
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiUser, FiHelpCircle, FiActivity, FiSettings, FiLogOut } from "react-icons/fi";
import styles from "../Login/Login.module.css"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:3004";

const Login = () => {

  const navigate = useNavigate()
  const [action,setAction]=useState("Sign Up")
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [showNewPassword,setShowNewPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  const signUp = async () => {
    try {
      const updatedData = { name, email, password }
      const response = await axios.post(`${BASE_URL}/user/create`, updatedData, { withCredentials: true });

      if (response.data.status === true) {
        toast.success(response.data.message);
        const userData = response.data.data;

        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData._id);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);

        window.dispatchEvent(new Event("authChange")); 

        setName(""); setEmail(""); setPassword("");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    }
  }

const login = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, { email, password }, { withCredentials: true });

      if (response.data.status === true) {
        const userData = response.data.data;
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData._id);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);

        window.dispatchEvent(new Event("authChange"));

        toast.success(response.data.message);
        setIsLoggedIn(true);

        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    }
  };

  const sendResetEmail = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/forgot-password`, { email });
      if (response.data.status === true) {
        toast.success(response.data.message);
        setAction("Verify OTP");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }
    const updated = [...otp];
    updated[index] = value[value.length - 1];
    setOtp(updated);
    if (index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/user/verify-otp`, { email, otp: enteredOtp });
      if (response.data.status === true) {
        toast.success(response.data.message);
        setOtp(["", "", "", "", "", ""]);
        setAction("Reset Password");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/user/reset-password`, { email, newPassword });
      if (response.data.status === true) {
        toast.success(response.data.message);
        setNewPassword("");
        setConfirmPassword("");
        setAction("Login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    }
  };

  if (isLoggedIn) {
    return (
      <div>
        <div className={styles.page}>
          <div className={styles.container}>
            <Profile onLogout={() => setIsLoggedIn(false)} />
          </div>
        </div>
      </div>
    )
  }

  if (action === "Verify OTP") {
    return (
      <div>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className="otp-header">Check your email</div>
            <p className="otp-description">
              Enter the code sent to <br />
              <span className="otp-email">{email}</span>
            </p>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-box"
                  value={digit}
                  ref={(el) => (otpRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>
            <div className={styles.btnContainer}>
              <button className={styles.loginBtn} onClick={verifyOtp}>Verify</button>
            </div>
            <div className="otp-resend">
              Can't find the email? Check your spam folder.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (action === "Reset Password") {
    return (
      <div>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.header}>Create New Password</div>
            <p className="np-description">
              Your new password must be different from any of your
              previous passwords.
            </p>
            <div className={styles.inputs}>
              <div className={`${styles.input} np-passwordField`}>
                <TbLockPassword size={30} className={styles.icon} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder='New Password'
                  required
                  onChange={(e)=>{setNewPassword(e.target.value)}}
                  value={newPassword}
                />
                {showNewPassword ? (
                  <FaEyeSlash size={22} className="np-eyeIcon" onClick={()=>setShowNewPassword(false)} />
                ) : (
                  <FaEye size={22} className="np-eyeIcon" onClick={()=>setShowNewPassword(true)} />
                )}
              </div>
              <div className={`${styles.input} np-passwordField`}>
                <TbLockPassword size={30} className={styles.icon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder='Confirm Password'
                  required
                  onChange={(e)=>{setConfirmPassword(e.target.value)}}
                  value={confirmPassword}
                />
                {showConfirmPassword ? (
                  <FaEyeSlash size={22} className="np-eyeIcon" onClick={()=>setShowConfirmPassword(false)} />
                ) : (
                  <FaEye size={22} className="np-eyeIcon" onClick={()=>setShowConfirmPassword(true)} />
                )}
              </div>
            </div>
            <div className={styles.btnContainer}>
              <button className={styles.loginBtn} onClick={resetPassword}>Reset Password</button>
            </div>
            <div className={styles.signUpNow}>
              Remember your password? {" "}
              <span onClick={()=>setAction("Login")}>Login</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (action === "Forgot Password") {
    return (
      <div>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.header}>Forgot Password</div>
            <p className="fp-description">
              Enter your email to reset your password.
            </p>
            <div className={styles.inputs}>
              <div className={styles.input}>
                <MdEmail size={30} className={styles.icon} />
                <input
                  type="email"
                  placeholder='Enter Email'
                  required
                  onChange={(e)=>{setEmail(e.target.value)}}
                  value={email}
                />
              </div>
            </div>
            <div className={styles.btnContainer}>
              <button className={styles.loginBtn} onClick={sendResetEmail}>Send Email</button>
            </div>
            <div className={styles.signUpNow}>
              Remember Password? {" "}
              <span onClick={()=>setAction("Login")}>Login</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>{action === "Sign Up" ? "Create Account":"Login"}</div>
        <p className={styles.smallHeader}>{action === "Sign Up" ? "Create your account":"Login to your account"}</p>
        <div className={styles.inputs}>
          {action==="Sign Up" && (
              <div className={styles.input}>
             <FaUserAlt size={30} className={styles.icon}/>
            <input type="text" placeholder='Name' required onChange={(e)=>{setName(e.target.value)}} value={name}/>
           </div>
          )}    
          <div className={styles.input}>
            <MdEmail size={30}  className={styles.icon}/>   
            <input type="email" placeholder='Email' required onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
          </div>
          <div className={styles.input}>
            <TbLockPassword size={30}  className={styles.icon}/>
            <input type="password" placeholder='Password' required onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
          </div>
{action !== "Sign Up" && (
<div className={styles.forgotContainer}>
  <span className={styles.forgotPassword} onClick={() => setAction("Forgot Password")}>
    Forgot Password ?
  </span>
</div>
)}
       </div> 
      <div className={styles.btnContainer}>
         <button className={styles.loginBtn} onClick={action === "Sign Up" ? signUp : login}>{action}</button>
      </div>
      {action === "Sign Up" ? (
        <div className={styles.signUpNow}>Already have an account? {" "}<span onClick={()=>setAction("Login")}>Login here</span></div>
      ) : (
        <div className={styles.signUpNow}>Don't have an account? {" "}<span onClick={()=>setAction("Sign Up")}>Sign up</span></div>
      )}
      </div> 
    </div>
    </div>
  )
}

export default Login

export const Profile = ({ onLogout }) => {

  const navigate = useNavigate();

  const userName = localStorage.getItem("name") || "Guest User";
  const userEmail = localStorage.getItem("email") || "guest@example.com";

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
      if (response.data.status === true) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");

      window.dispatchEvent(new Event("authChange")); // 👈 ADDED

      if (onLogout) onLogout();

      navigate("/login");
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-topRow">
        <div className="profile-info">
          <h6 className="profile-name">{userName}</h6>
          <span className="profile-email">{userEmail}</span>
        </div>
        <div className="profile-avatar">
          <FiUser size={20} />
        </div>
      </div>

      <div className="profile-menu">
        <div className="profile-menuItem">
          <FiUser className="profile-menuIcon" />
          <span>Profile</span>
        </div>
        <div className="profile-menuItem">
          <FiHelpCircle className="profile-menuIcon" />
          <span>Help</span>
        </div>
        <div className="profile-menuItem">
          <FiActivity className="profile-menuIcon" />
          <span>Activity</span>
        </div>
        <div className="profile-menuItem">
          <FiSettings className="profile-menuIcon" />
          <span>Settings</span>
        </div>
      </div>

      <div className="profile-divider"></div>

      <div className="profile-menuItem profile-signout" onClick={handleLogout}>
        <FiLogOut className="profile-menuIcon" />
        <span>Sign out</span>
      </div>
    </div>
  );
};