import "./App.css"
import React, { useState } from 'react';
import { printAllUsers, initializePharmecies } from './UserManagementUtils'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import MainScreen from './MainSceen'
import Welcome from './Welcome'

initializePharmecies()
printAllUsers()

export default function App() {
  let [user, setUser] = useState(null);
  user = { userName: 'Moshe', password: "123", locationId: 5000 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      {user ? <MainScreen user={user} /> : <Welcome setUser={setUser} />}
    </div>
  );
}

