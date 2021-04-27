import "./App.css"
import React, { useState } from 'react';
import { printAllUsers, initializePharmecies } from './UserManagementUtils'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import MainScreen from './MainSceen'
import Welcome from './Welcome'

initializePharmecies()
printAllUsers()

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {user ? <MainScreen user={user} /> : <Welcome setUser={setUser} />}
    </div>
  );
}



// function Clicker(props) {
//   const onClick = () => {
//     setNumber(number + 1)
//     console.log('clicked')
//     console.log(number)
//   }

//   return (<button className="btn btn-primary btn-block" onClick={onClick}>{props.number} </button>)
// }

// export default function App(props) {
//   const [number, setNumber] = useState(0);

//   console.log('render')

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <h1>number is {number}</h1>
//       <Clicker number={number} setNumber={setNumber} />
//     </div>
//   )
// }
