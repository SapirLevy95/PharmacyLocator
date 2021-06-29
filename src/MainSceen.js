import "./App.css"
import React, { useState } from 'react';
import { getPharmacy, updateUserLocationInDb } from './UserManagementUtils'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet';
import { getDistance } from 'geolib';
import pharmaciesDataFromJson from './data/pharmacy.json';

const DISTANCE = 5000
export default function MainScreen(props) {
  const [data, setData] = useState({
    user: props.user,
    pharmacy: null,
  });
  const [deviceLocation, setDeviceLocation] = useState(null);
  const { user, pharmacy } = data
  const [map, setMap] = useState(null)


  if (!deviceLocation) {
    navigator.geolocation.getCurrentPosition((position) => { setDeviceLocation(position) })
  }

  if (!pharmacy && user.locationId) {
    getPharmacy(user.locationId).then((updatedPharmacy) => {
      setData({
        user: user,
        pharmacy: updatedPharmacy
      })
    })
  }

  const changePharmacy = async (ClickedPharmecy) => {
    const newLocation = user.locationId == ClickedPharmecy.id ? null : ClickedPharmecy.id
    const updatedUser = await updateUserLocationInDb(newLocation, user)
    const updatedPharmacy = await getPharmacy(updatedUser.locationId)
    setData({ user: updatedUser, pharmacy: updatedPharmacy })
  }


  const x = deviceLocation ? deviceLocation.coords.latitude : null
  const y = deviceLocation ? deviceLocation.coords.longitude : null
  const pharmacies = pharmaciesDataFromJson.map((pharmecy) => {
    return {
      name: pharmecy.properties.name,
      id: pharmecy.properties.osm_id,
      x: pharmecy.geometry.coordinates[0],
      y: pharmecy.geometry.coordinates[1],
      distanceFromDevice: x && y ? getDistance(
        { latitude: pharmecy.geometry.coordinates[1], longitude: pharmecy.geometry.coordinates[0] },
        { latitude: x, longitude: y }) : null
    }
  })


  let filteredPharmacies = pharmacies.filter((pharmecy) => pharmecy.distanceFromDevice < DISTANCE && pharmecy.name && pharmecy.name != '')
  filteredPharmacies = filteredPharmacies.sort((pharmecy1, pharmecy2) => pharmecy1.distanceFromDevice - pharmecy2.distanceFromDevice)
  const pharmaciesComponent = filteredPharmacies.map((pharmecy) => (
    <button type="button"
      className="btn btn-light"
      onClick={() => onPharmacyClicked(pharmecy)}
      style={{
        textAlign: "right",
        margin: "1px",
        background: "#ff8100",
        borderColor: "#ff8100",
        width: "400px"
      }}>{pharmecy.name} ({pharmecy.distanceFromDevice} מטרים)</button>)
  )

  const pharmeciesMarkers = filteredPharmacies.map((pharmecy) =>
    <Marker id={pharmecy.id} position={[pharmecy.y, pharmecy.x]}>
      <Popup>
        <div style={{ textAlign: 'right' }} >
          <h6>{pharmecy.name} - {pharmecy.distanceFromDevice} מטרים</h6>
          <button className="btn btn-primary btn-block" style={{ background: "#ff8100", borderColor: "#858585", marginTop: "7px" }}
            onClick={async () => changePharmacy(pharmecy)}>{user.locationId === pharmecy.id ? "אשר עזיבתך" : "אשר נוכחותך"}</button>
        </div>
      </Popup>
    </Marker >
  )




  const pharmacyListCompoent = (
    <div style={{ direction: 'rtl' }}>
      <h4 style={{ color: "white" }}>בתי מרקחת באיזורך (עד 5 ק"מ)</h4>
      <div style={{ textAlign: "right", overflowX: "hidden", overflowY: "scroll", height: "250px", display: "flex", flexDirection: "column", alignItems: 'end' }}>
        {pharmaciesComponent}
      </div>
    </div>

  )




  var myDeviceLocationMarker = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [30, 50],
  });

  const deviceMarker = deviceLocation ? (
    <Marker icon={myDeviceLocationMarker} position={[x, y]}>
      <Popup>
        אתה נמצא כאן
      </Popup>
    </Marker>) : null

  const mapComponent = (<div style={{ background: 'white' }}>
    <MapContainer center={[x, y]} zoom={12} style={{ height: '400px' }} whenCreated={setMap}      >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle center={[x, y]} radius={DISTANCE} />
      {deviceMarker}
      {pharmeciesMarkers}
    </MapContainer>
  </div>)


  const onPharmacyClicked = (clickedPharmecy) => {
    console.log(`Pharmacy ${clickedPharmecy} clicked`)
    console.log(clickedPharmecy)
    console.log(pharmeciesMarkers)
    for (var markerPosition in pharmeciesMarkers) {
      const marker = pharmeciesMarkers[markerPosition]
      var pharmecyId = marker.props.id;
      if (pharmecyId == clickedPharmecy.id) {
        map.setView([clickedPharmecy.y, clickedPharmecy.x], 15, { animation: true });
      };
    }
  }


  let comment
  if (pharmacy) {
    comment = (
      <div style={{ padding: '10px' }}>
        <h4 style={{ color: "white", direction: "rtl" }}> אתה ממוקם ב{pharmacy.name} עם עוד {pharmacy.count} אנשים.</h4>
        <button style={{ background: '#ff8100' }} className="btn btn-block" onClick={async () => { changePharmacy(pharmacy) }}>
          אני לא כאן
      </button>
      </div>)
  }
  else {
    comment = <h4 style={{ color: "white", direction: "rtl" }}> אתה לא נמצא בשום בית מרקחת.
  </h4>
  }


  const userLocationStatusCompoent = (<div style={{ padding: '10px' }} >
    <h3 style={{ textAlign: 'center', color: "white" }}> ,היי {user.userName}</h3>
    {comment}
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
              {deviceLocation ? mapComponent : null}
            </div>
          </div>
        </div>
      </div>

    </div>)
}
