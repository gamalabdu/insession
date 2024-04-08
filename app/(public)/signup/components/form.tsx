"use client";

import { signUp } from "@/actions/auth";
import { useState, useTransition } from "react";
import { GiSoundWaves } from "react-icons/gi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function Form() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await signUp(formData);
          // display error
        })
      }
      className="container"
    >
      {/* <img className='login-pic' src={hyphenLogo} alt="" /> */}
      <GiSoundWaves size={40} />
      <div className="login-title">Log in To Continue</div>

      <div className="inp">
        <input
          className="login-input"
          type="text"
          id="username"
          name="username"
          // onChange={(e) => handleInputChange(e, "username")}
          // onBlur={() => handleInputBlur("username")}
        />

        <label className={`login-label up`} htmlFor="username">
          Username
        </label>
      </div>
      <div className="inp">
        <input
          className="login-input"
          type="email"
          id="email"
          name="email"
          // onChange={(e) => handleInputChange(e, "email")}
          // onBlur={() => handleInputBlur("email")}
        />

        <label className={`login-label up`} htmlFor="email">
          Email
        </label>
      </div>

      <div className="inp">
        <input
          className="login-input-password"
          type={passwordVisible ? "text" : "password"}
          id="password"
          name="password"
          // onChange={(e) => handleInputChange(e, "password")}
          // onBlur={() => handleInputBlur("password")}
        />

        <label className={`login-label up`} htmlFor="password-input">
          Password
        </label>
        <span
          className="password-eye"
          onClick={() => setPasswordVisible((prev) => !prev)}
        >
          {passwordVisible ? <IoMdEye /> : <IoMdEyeOff />}
        </span>
      </div>

      <div style={{ display: "flex" }}>
        <a className="forgot-password-signup" href="">
          Forgot Password? - Support
        </a>
      </div>

      <button className="login-btn" disabled={isPending} type="submit">
        Sign Up
      </button>
      <a className="forgot-password-signup" href="/login">
        Already have an account? Log In
      </a>
    </form>
  );
}
