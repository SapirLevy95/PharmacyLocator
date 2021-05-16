import "./App.css"
import React, { useState, useEffect } from 'react';
import { getLocationFromDb } from './UserManagementUtils'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { getDistance } from 'geolib';
import pharmaciesDataFromJson from './data/pharmacy.json';



export default function MainScreen(props) {
  const [mode, setMode] = useState('confirmPresence');
  const [deviceLocation, setDeviceLocation] = useState(null);

  const { userName, password, locationId } = props.user
  const location = getLocationFromDb(locationId)

  let mapComponent = null
  let pharmacyListCompoent = null
  if (deviceLocation) {
    const x = deviceLocation.coords.latitude
    const y = deviceLocation.coords.longitude

    console.log(pharmaciesDataFromJson)

    const pharmacies = pharmaciesDataFromJson.map((pharmecy) => {
      return {
        name: pharmecy.properties.name,
        id: pharmecy.properties.osm_id,
        x: pharmecy.geometry.coordinates[0],
        y: pharmecy.geometry.coordinates[1],
        distanceFromDevice: getDistance(
          { latitude: pharmecy.geometry.coordinates[1], longitude: pharmecy.geometry.coordinates[0] },
          { latitude: x, longitude: y })
      }
    })

    console.log(pharmacies)
    let filteredPharmacies = pharmacies.filter((pharmecy) => pharmecy.distanceFromDevice < 5000 && pharmecy.name && pharmecy.name != '')
    filteredPharmacies = filteredPharmacies.sort((pharmecy1, pharmecy2) => pharmecy1.distanceFromDevice - pharmecy2.distanceFromDevice)
    const pharmaciesComponent = filteredPharmacies.map((pharmecy) => <button type="button" class="btn btn-light" style={{ textAlign: "right", margin: "1px", background: "#ff8100", borderColor: "#ff8100", width: "400px" }}>{pharmecy.name} ({pharmecy.distanceFromDevice} מטרים)</button>
    )

    pharmacyListCompoent = (
      <div style={{ direction: 'rtl' }}>
        <h4 style={{ color: "white" }}>בתי מרקחת באיזורך (עד 5 ק"מ)</h4>
        <div style={{ textAlign: "right", overflowX: "hidden", overflowY: "scroll", height: "250px", display: "flex", flexDirection: "column", alignItems: 'end' }}>
          {pharmaciesComponent}
        </div>
      </div>

    )

    console.log(pharmacies)


    const onSwitchMode = (x => {
      if (mode == 'confirmPresence') {
        setMode('confirmLeaving')
      } else {
        setMode('confirmPresence')
      }
    })

    const pharmeciesMarkers = filteredPharmacies.map((pharmecy) =>
      <Marker position={[pharmecy.y, pharmecy.x]}>
        <Popup>
          <div style={{ textAlign: 'right' }} >
            <h6>{pharmecy.name} - {pharmecy.distanceFromDevice} מטרים</h6>
            <h8 >כמות אנשים : 25</h8>
            <button className="btn btn-primary btn-block" style={{ background: "#ff8100", borderColor: "#858585", marginTop: "7px" }} onClick={onSwitchMode}>{mode === 'confirmPresence' ? 'אשר עזיבתך' : 'אשר נוכחותך'}</button>
          </div>
        </Popup>
      </Marker >
    )


    var myDeviceLocationMarker = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [30, 50],
    });

    mapComponent = (<div style={{ background: 'white' }}>
      <MapContainer center={[x, y]} zoom={12} style={{ height: '400px' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={myDeviceLocationMarker} position={[x, y]}>
          <Popup>
            Your Location
          </Popup>
        </Marker>
        {pharmeciesMarkers}
      </MapContainer>
    </div>)
  } else {
    navigator.geolocation.getCurrentPosition((position) => { setDeviceLocation(position) })
    const mapComponent = null
    pharmacyListCompoent = null
  }


  const userLocationStatusCompoent = (<div style={{ padding: '10px' }} >
    <h3 style={{ textAlign: 'center', color: "white" }}> ,היי {userName}</h3>
    <h4 style={{ color: "white", direction: "rtl" }}> אתה ממוקם ב{location.name} עם עוד {location.count} אנשים.</h4>
    <div style={{ padding: '10px' }}>
      <button style={{ background: '#ff8100' }} className="btn btn-block" onClick={() => { console.log('on click Im not here') }}>
        אני לא כאן
      </button>
    </div>
  </div>)


  return (
    <div style={{ textAlign: "right", display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <div>
        <h1 style={{ color: "white", textAlign: "right" }}>מצא בית מרקחת</h1>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'stretch' }} >
          <div style={{ flex: 1 }}>
            {userLocationStatusCompoent}
          </div>
          <div style={{ flex: 3 }}>
            <div>
              {pharmacyListCompoent}
              {mapComponent}
            </div>
          </div>
        </div>
      </div>

    </div>)
}
