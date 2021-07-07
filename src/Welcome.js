import "./App.css";
import React, { useState } from "react";
import {
  getUserFromDB,
  addUserToDB,
  printAllUsers,
  user_db,
  isUsernameExists,
} from "./UserManagementUtils";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "./images/logo.png";

export default function Welcome(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mode, setMode] = useState("logIn");
  const setUser = props.setUser;

  const cleanMessages = () => {
    setSuccessMessage("");
    setMessage("");
  };

  const onLogIn = async () => {
    cleanMessages();
    const user = await getUserFromDB(userName, password);
    if (user) {
      setUser(user);
    } else {
      setMessage("User name or password is invalid");
      setPassword("");
    }
  };

  const onSignUp = async () => {
    cleanMessages();
    if (!userName || !password) {
      setMessage("Username or password is");
      return;
    }

    if (await isUsernameExists(userName)) {
      setMessage("The username is already exists");
      return;
    }

    if (password != verifyPassword) {
      setVerifyPassword("");
      setMessage("Password confirmation isn't correct");
      return;
    }
    const user = await addUserToDB(userName, password);

    if (user) {
      setSuccessMessage("You have succsesfully registered");
      setMode("logIn");
      setPassword("");
    } else {
      setMessage("Error");
      setUserName("");
      setPassword("");
      setVerifyPassword("");
    }
  };

  const onSwitchMode = (x) => {
    cleanMessages();
    if (mode == "logIn") {
      setMode("signUp");
    } else {
      setMode("logIn");
    }
  };

  // const text = mode === "logIn" ? "Log In" : "Sign Up";
  return (
    <div
      className="box"
      style={{
        width: "300px",
        padding: "10px",
        margin: "auto",
        textAlign: "left",
      }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <img src={logo} alt="Logo" />
          <h3>{mode === "logIn" ? "Log In" : "Sign Up"}</h3>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <div style={{ padding: "5px", marginBottom: "7px" }}>
            <label>Username</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter a username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div style={{ padding: "5px", marginBottom: "7px" }}>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {mode == "signUp" ? (
            <div style={{ padding: "5px", marginBottom: "7px" }}>
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </div>
          ) : null}
        </div>
        {message ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : null}
        {successMessage ? (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        ) : null}
        <button
          className="btn btn-primary btn-block"
          style={{ background: "#ff8100", borderColor: "#858585" }}
          onClick={mode === "logIn" ? onLogIn : onSignUp}
        >
          {mode === "logIn" ? "Log In" : "Sign Up"}
        </button>
        <button
          className="btn btn-primary btn-block"
          style={{ background: "#ff8100", borderColor: "#858585" }}
          onClick={onSwitchMode}
        >
          {mode === "logIn" ? "Go to sign up" : "Go to Login"}
        </button>
      </div>
    </div>
  );
}
