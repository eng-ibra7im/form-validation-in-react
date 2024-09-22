import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Hook to handle location
function LocationMarker({ setAddress }) {
  const [position, setPosition] = useState(null);
  const [popupMessage, setPopupMessage] = useState("انا اهوووووووووو");

  const map = useMapEvents({
    click(e) {
      const latlng = e.latlng;
      reverseGeocode(latlng.lat, latlng.lng, setPopupMessage);
      setPosition(latlng);
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);
          setPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error(err);
          alert("Error fetching your location.");
        }
      );
    }
  }, [map]);

  const MarkerIcon = new L.Icon ({
    iconUrl : require("./map-marker-icon-vector-12860544.jpg"),
    iconSize :[35 , 45],
    iconAnchor :[17 , 46],
    popupAnchor :[3 , -46],
  })

  return position === null ? null : (
    <Marker position={position}icon={MarkerIcon} >
      <Popup>{popupMessage}</Popup>
    </Marker>
  );
}

// Reverse geocoding using Nominatim API
async function reverseGeocode(lat, lng, setPopupMessage) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.address) {
      const address = `${data.address.road || ""}, ${data.address.suburb || ""}, ${
        data.address.city || ""
      }, ${data.address.state || ""}, ${data.address.country || ""}`;
      setPopupMessage(address.trim() || "Address not found");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    setPopupMessage("Error fetching address");
  }
}

const MapWithLocationPicker = () => {
  const [address, setAddress] = useState("");

  return (
    <div>
      <MapContainer
        style={{ height: "80vh", width: "70%" }}
        center={[51.505, -0.09]} // Default center if geolocation fails
        zoom={13}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=FgTcHmkWZ76Vw4keNYON"
          attribution=' &copy; <a href="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=FgTcHmkWZ76Vw4keNYON">OpenStreetMap</a> contributors'
        />
        <LocationMarker setAddress={setAddress} />
      </MapContainer>
    </div>
  );
};

export default MapWithLocationPicker;
