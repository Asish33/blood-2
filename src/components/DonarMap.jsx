import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DonorMap = ({ selectedCity }) => {
  // Dummy donor locations (You should fetch from backend later)
  const donorLocations = [
    { lat: 13.0827, lng: 80.2707, name: "Donor 1 (Chennai)" },
    { lat: 12.9716, lng: 77.5946, name: "Donor 2 (Bangalore)" },
    { lat: 9.9252, lng: 78.1198, name: "Donor 3 (Madurai)" },
    { lat: 17.3850, lng: 78.4867, name: "Donor 4 (Hyderabad)" },
  ];

  const cityCoords = {
    Chennai: [13.0827, 80.2707],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Madurai: [9.9252, 78.1198],
  };

  // Use default if selectedCity is invalid
  const hospitalCity = selectedCity && cityCoords[selectedCity] ? selectedCity : 'Chennai';
  const hospitalCoords = cityCoords[hospitalCity];

  // Utility to calculate distance between two lat/lng in km
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter donors within 300km
  const nearbyDonors = donorLocations.filter(donor => {
    const distance = getDistanceFromLatLonInKm(
      hospitalCoords[0],
      hospitalCoords[1],
      donor.lat,
      donor.lng
    );
    return distance <= 300;
  });

  // Default Leaflet marker fix
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  return (
    <div>
      <h3>Donor Map (within 300km of {hospitalCity})</h3>
      <MapContainer center={hospitalCoords} zoom={7} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={hospitalCoords}
          radius={300000}
          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
        />
        <Marker position={hospitalCoords}>
          <Popup>Hospital: {hospitalCity}</Popup>
        </Marker>
        {nearbyDonors.map((donor, index) => (
          <Marker key={index} position={[donor.lat, donor.lng]}>
            <Popup>{donor.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DonorMap;