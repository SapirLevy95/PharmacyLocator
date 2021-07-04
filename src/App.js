import "./App.css";
import React, { useState } from "react";
import { printAllUsers, initializePharmecies } from "./UserManagementUtils";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import MainScreen from "./MainSceen";
import Welcome from "./Welcome";

initializePharmecies();
printAllUsers();

export default function App() {
  let [user, setUser] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {user ? (
        <MainScreen user={user} setUser={setUser} />
      ) : (
        <Welcome setUser={setUser} />
      )}
    </div>
  );
}
