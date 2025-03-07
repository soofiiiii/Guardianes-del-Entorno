import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const MapaInteractivo = ({ lat, lng, areaName }) => {
  // Convertir a número para evitar errores si la API devuelve strings
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],  // Tamaño del ícono
    iconAnchor: [12, 41], // Punto de anclaje
    popupAnchor: [1, -34], 
    shadowSize: [41, 41],
  });
  
  // Verificar si las coordenadas son válidas
  if (isNaN(latitude) || isNaN(longitude)) {
    return <p style={{ textAlign: "center", color: "red" }}>Ubicación no disponible.</p>;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{ height: "400px", width: "100%", borderRadius: "10px", marginTop: "20px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
        <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
                <strong>{areaName}</strong>
                <br />
                Ubicación aproximada.
            </Popup>
        </Marker>

    </MapContainer>
  );
};

export default MapaInteractivo;
