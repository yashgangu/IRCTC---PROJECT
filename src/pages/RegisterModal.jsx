import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/AuthModal.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import { clearError, loginWithGoogleAsync, registerWithEmailAsync } from "../redux/auth/authSlice";

const RegisterModal = ({ isOpen, onClose, switchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleRegister = async (e)=>{
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(registerWithEmailAsync({email , password ,fullName}));
    if(registerWithEmailAsync.fulfilled.match(result)){
      toast.success("User Registered Successfully");
      setEmail("");
      setPassword("");
      setFullName("");
      onClose();
    }
  }

  const handleGoogleRegister = async(e) =>{
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(loginWithGoogleAsync());
    if (loginWithGoogleAsync.fulfilled.match(result)) {
      toast.success("User Logged In Successfully");
      onClose();
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.show : ""}`}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? " Registering..." : "Register"}</button>
        </form>

        <button className={styles.googleBtn} onClick={handleGoogleRegister}>
          <FcGoogle /> Register with Google
        </button>

        <p onClick={switchToLogin}>Already have an account? Login</p>
      </div>
    </div>
  );
};

export default RegisterModal;