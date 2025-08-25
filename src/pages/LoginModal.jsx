import React, {useState } from "react";
import styles from "../styles/AuthModal.module.css";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {loginWithEmailAsync,loginWithGoogleAsync,clearError } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"

const LoginModal = ({ isOpen, onClose, switchToRegister,onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading , error} = useSelector((state) => state.auth);
 

  if (!isOpen) return null;

  const handleEmailLogin =async (e)=>{
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginWithEmailAsync({email , password}));
    if(loginWithEmailAsync.fulfilled.match(result)){
      toast.success("Login Successful");
      setEmail("");
      setPassword("");
      onClose();
    }
  }

  const handleGoogleLogin = async (e) =>{
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginWithGoogleAsync());
    if(loginWithGoogleAsync.fulfilled.match(result)){
      toast.success("Login Successful");
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
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleEmailLogin}>
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
          <button  type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>

        <button className={styles.googleBtn} onClick={handleGoogleLogin}>
          <FcGoogle /> Login with Google
        </button>

        <p onClick={switchToRegister}>Don't have an account? Register</p>
      </div>
    </div>
  );
};

export default LoginModal;