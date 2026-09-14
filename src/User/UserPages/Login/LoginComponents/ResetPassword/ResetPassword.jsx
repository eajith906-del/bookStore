import React from 'react'
import { useState } from 'react';
import { MdEmail } from "react-icons/md";
import styles from "../../Login/Login.module.css"   // 👈 same CSS module as Login/SignUp — theme, colors, fonts all match
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const sendResetEmail = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true)
      const response = await axios.post(
        "https://bookstore-be-y5au.onrender.com/user/forgot-password",
        { email }
      );

      console.log("Response:", response.data);

      if (response.data.status === true) {
        toast.success(response.data.message || "Reset instructions sent to your email");
        setEmail("")
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("API error:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <div className={styles.page}>

        <div className={styles.container}>

          <div className={styles.header}>Forgot Password</div>
          <p className={styles.smallHeader}>
            Enter the email address you used to create the account,
            and we will send you instructions to reset your password.
          </p>

          <div className={styles.inputs}>
            <div className={styles.input}>
              <MdEmail size={30} className={styles.icon} />
              <input
                type="email"
                placeholder='Enter Email'
                required
                onChange={(e) => { setEmail(e.target.value) }}
                value={email}
              />
            </div>
          </div>

          <div className={styles.btnContainer}>
            <button
              className={styles.loginBtn}
              onClick={sendResetEmail}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>

          <div className={styles.signUpNow}>
            Remember Password?{" "}
            <span onClick={() => navigate("/Login")}>Login</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ResetPassword