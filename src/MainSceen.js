import "./App.css"
import React, { useState } from 'react';


export default function MainScreen(props) {
  // Option 1 
  // const userName = porps.user.userName
  // const password = porps.user.password

  // Option 2
  const { userName, password } = props.user

  return (
    <div>
      <h1>Main Screen</h1>
      <h3>{userName}</h3>
      <h3>{password}</h3>
    </div>)
}
