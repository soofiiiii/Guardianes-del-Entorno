import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Componente del mapa interactivo
const MapaInteractivo = ({ lat, lng, areaName }) => {
  // Convertir latitud y longitud a números para evitar errores
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  // Crear un icono personalizado para el marcador
  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],      // Tamaño del icono
    iconAnchor: [12, 41],    // Punto de anclaje del icono
    popupAnchor: [1, -34],   // Posición del popup relativo al icono
    shadowSize: [41, 41],
  });

  // Verificar si las coordenadas son válidas
  if (isNaN(latitude) || isNaN(longitude)) {
    return <p style={{ textAlign: "center", color: "red" }}>Ubicación no disponible.</p>;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}  // Centro del mapa
      zoom={10}                         // Nivel de zoom
      style={{ height: "400px", width: "100%", borderRadius: "10px", marginTop: "20px" }}
    >
      {/* Capa de mosaicos de OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {/* Marcador con el icono personalizado */}
      <Marker position={[latitude, longitude]} icon={customIcon}>
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
