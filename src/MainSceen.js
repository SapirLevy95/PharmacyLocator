import "./App.css";
import React, { useState } from "react";
import {
  getPharmacyFromDB,
  updateUserLocationInDb,
  getPharmaciesCountFromDB,
} from "./UserManagementUtils";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L, { icon } from "leaflet";
import { getDistance } from "geolib";
import pharmaciesDataFromJson from "./data/pharmacy.json";

const DISTANCE = 5000;
export default function MainScreen(props) {
  const [data, setData] = useState({
    isInit: false,
    user: props.user,
    pharmacy: null,
    pharmaciesCount: {},
  });
  const [deviceLocation, setDeviceLocation] = useState(null);
  const { user, pharmacy } = data;
  const [map, setMap] = useState(null);
  const setUser = props.setUser;

  if (!deviceLocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setDeviceLocation(position);
    });
  }

  const asyncFetchDataFromDB = async () => {
    const updatedPharmacy = await getPharmacyFromDB(user.locationId);
    const pharmaciesCount = await getPharmaciesCountFromDB();
    setData({
      isInit: true,
      user: user,
      pharmacy: updatedPharmacy,
      pharmaciesCount: pharmaciesCount,
    });
  };

  if (!data.isInit) {
    asyncFetchDataFromDB();
    return <div>Loading...</div>;
  }

  const changePharmacy = async (ClickedPharmecy) => {
    const newLocation =
      user.locationId == ClickedPharmecy.id ? null : ClickedPharmecy.id;
    const updatedUser = await updateUserLocationInDb(newLocation, user);
    const updatedPharmacy = await getPharmacyFromDB(updatedUser.locationId);
    const pharmaciesCount = await getPharmaciesCountFromDB();
    setData({
      user: updatedUser,
      pharmacy: updatedPharmacy,
      pharmaciesCount: pharmaciesCount,
      isInit: true,
    });
  };

  const getPharmacyCount = (pharmacy) => {
    return (
      (data.pharmaciesCount ? data.pharmaciesCount[pharmacy.id] : null) || 0
    );
  };
  const deviceLocationX = deviceLocation
    ? deviceLocation.coords.latitude
    : null;
  const deviceLocationY = deviceLocation
    ? deviceLocation.coords.longitude
    : null;
  const pharmacies = pharmaciesDataFromJson.map((pharmecy) => {
    const distance =
      deviceLocationX && deviceLocationY
        ? getDistance(
            {
              latitude: pharmecy.geometry.coordinates[1],
              longitude: pharmecy.geometry.coordinates[0],
            },
            { latitude: deviceLocationX, longitude: deviceLocationY }
          )
        : null;
    return {
      name: pharmecy.properties.name,
      id: pharmecy.properties.osm_id,
      x: pharmecy.geometry.coordinates[0],
      y: pharmecy.geometry.coordinates[1],
      distanceFromDevice: distance,
    };
  });

  let filteredPharmacies = pharmacies.filter(
    (pharmecy) =>
      pharmecy.distanceFromDevice < DISTANCE &&
      pharmecy.name &&
      pharmecy.name != ""
  );
  filteredPharmacies = filteredPharmacies.sort(
    (pharmecy1, pharmecy2) =>
      pharmecy1.distanceFromDevice - pharmecy2.distanceFromDevice
  );
  const pharmaciesComponent = filteredPharmacies.map((pharmecy) => (
    <button
      id={pharmecy.id}
      type="button"
      className="btn btn-light"
      onClick={() => onPharmacyClicked(pharmecy)}
      style={{
        textAlign: "right",
        margin: "1px",
        background: "#ff8100",
        borderColor: "#ff8100",
        width: "400px",
      }}
    >
      {pharmecy.name} ({pharmecy.distanceFromDevice} מטרים,{" "}
      {getPharmacyCount(pharmecy)} אנשים)
    </button>
  ));

  var pharmecyMarkerIcan = L.icon({
    iconUrl: "https://image.flaticon.com/icons/png/512/1453/1453644.png",
    iconSize: [40, 40],
  });
  var superPharmMarkerIcan = L.icon({
    iconUrl:
      "https://service.tlvmall.com/Uploads//Stores/%D7%A1%D7%95%D7%A4%D7%A8%20%D7%A4%D7%90%D7%A8%D7%9D/logo_super-pharm.png",
    iconSize: [40, 40],
  });
  var myDeviceLocationMarker = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [30, 50],
  });

  const pharmeciesMarkers = filteredPharmacies.map((pharmecy) => {
    const icon = pharmecy.name.includes("סופר")
      ? superPharmMarkerIcan
      : pharmecyMarkerIcan;
    return (
      <Marker id={pharmecy.id} position={[pharmecy.y, pharmecy.x]} icon={icon}>
        <Popup>
          <div style={{ textAlign: "center" }}>
            <h6>{pharmecy.name}</h6>
            <h7>{pharmecy.distanceFromDevice} meters</h7>
            <div>
              {" "}
              The amount of people at this pharmacy is{" "}
              {getPharmacyCount(pharmecy)}
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{
                background: "#ff8100",
                borderColor: "#858585",
                marginTop: "7px",
              }}
              onClick={async () => changePharmacy(pharmecy)}
            >
              {user.locationId === pharmecy.id
                ? "Confirm your living"
                : "Confirm your presence"}
            </button>
          </div>
        </Popup>
      </Marker>
    );
  });

  const pharmacyListCompoent = (
    <div
      style={{
        textAlign: "right",
        overflowX: "hidden",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "350px",
      }}
    >
      {pharmaciesComponent}
    </div>
  );

  const deviceMarker = deviceLocation ? (
    <Marker
      icon={myDeviceLocationMarker}
      position={[deviceLocationX, deviceLocationY]}
    >
      <Popup>Your'e here</Popup>
    </Marker>
  ) : null;

  const mapComponent = (
    <div
      style={{ background: "white", borderRadius: "5px", marginLeft: "10px" }}
    >
      <MapContainer
        center={[deviceLocationX, deviceLocationY]}
        zoom={12}
        style={{ height: "600px", borderRadius: "5px" }}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={[deviceLocationX, deviceLocationY]} radius={DISTANCE} />

        {deviceMarker}
        {pharmeciesMarkers}
      </MapContainer>
    </div>
  );

  const onPharmacyClicked = (clickedPharmecy) => {
    for (var markerPosition in pharmeciesMarkers) {
      const marker = pharmeciesMarkers[markerPosition];
      var pharmecyId = marker.props.id;
      if (pharmecyId == clickedPharmecy.id) {
        map.setView([clickedPharmecy.y, clickedPharmecy.x], 15, {
          animation: true,
        });
      }
    }
  };

  let comment;
  if (pharmacy) {
    comment = (
      <div style={{ padding: "10px" }}>
        <div style={{ color: "white", direction: "rtl", textAlign: "left" }}>
          <h7>
            {" "}
            with {pharmacy.count} people {pharmacy.name} :Your'e located in
          </h7>
        </div>
        <button
          style={{ background: "#ff8100" }}
          className="btn btn-block"
          onClick={async () => {
            changePharmacy(pharmacy);
          }}
        >
          I'm not here
        </button>
      </div>
    );
  } else {
    comment = (
      <h4 style={{ color: "white", direction: "rtl", textAlign: "center" }}>
        {" "}
        Your'e not in a pharmacy...yet
      </h4>
    );
  }

  const userLocationStatusCompoent = (
    <div
      style={{
        padding: "10px",
        background: "#84cbf563",
        borderRadius: "5px",
        marginBottom: "10px",
        height: "170px",
      }}
    >
      <h3 style={{ textAlign: "center", color: "white" }}>
        {" "}
        Hello {user.userName}
      </h3>
      {comment}
    </div>
  );

  const backToLogInPage = () => {
    setUser(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <button
          className="btn btn-light"
          style={{ borderRadius: "50px", height: "50px", opacity: "0.95" }}
          onClick={backToLogInPage}
        >
          Back
        </button>
      </div>
      <div>
        <h1 style={{ color: "white", textAlign: "center" }}>Find a pharmacy</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          height: "600px",
        }}
      >
        <div style={{ flex: 3 }}>{deviceLocation ? mapComponent : null}</div>
        <div
          style={{ display: "flex", flexDirection: "column", width: "485px" }}
        >
          <div>{userLocationStatusCompoent}</div>
          <div
            style={{
              flex: 1,
              position: "relative",
              height: "300px",
              background: "#84cbf563",
              borderRadius: "5px",
              padding: "20px",
            }}
          >
            <h4 style={{ color: "white", textAlign: "right" }}>
              Pharmacies in your area (up to 5 km)
            </h4>
            {pharmacyListCompoent}
          </div>
        </div>
      </div>
    </div>
  );
}
