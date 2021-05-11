import "./App.css"
import React, { useState } from 'react';
import { getLocation } from './UserManagementUtils'

export default function MainScreen(props) {
  // Option 1 
  // const userName = porps.user.userName
  // const password = porps.user.password

  // Option 2
  const { userName, password, locationId } = props.user
  const location = getLocation(locationId)

  const userLocationStatusCompoent = (<div style={{ padding: '10px' }} >
    <h3 style={{ textAlign: 'center' }}>Hi {userName},</h3>
    <h4 >You are located in {location.name} with {location.count} pepole.</h4>
    <div style={{ padding: '10px' }}>
      <button style={{ background: 'white' }} className="btn btn-block" onClick={() => { console.log('on click Im not here') }}>
        I’m not here
      </button>
    </div>
  </div>)

  const pharmacyListCompoent = <div>
    <h3>Pharmacy 1</h3>
    <h3>Pharmacy 2</h3>
    <h3>Pharmacy 3</h3>
    <h3>Pharmacy 4</h3>
  </div>

  const mapComponent = <div style={{ background: 'white' }}>
    <h1>Map</h1>
  </div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div>
        <h1>Find a pharmacy</h1>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'stretch' }} >
          <div style={{ flex: 1, background: 'red' }}>
            {userLocationStatusCompoent}
          </div>
          <div style={{ flex: 3, background: 'purple' }}>
            <div>
              {pharmacyListCompoent}
              {mapComponent}
            </div>
          </div>
        </div>
      </div>

    </div>)
}
