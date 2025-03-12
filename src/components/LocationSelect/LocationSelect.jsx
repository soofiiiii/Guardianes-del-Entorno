import React, { useState, useEffect } from 'react';
import { getCountries } from '../../services/countriesService';

const LocationSelect = ({ name, value, onChange, required }) => {
  // Estado para guardar la lista de ubicaciones (países)
  const [locations, setLocations] = useState([]);
  // Estado para mostrar mensaje de carga
  const [loading, setLoading] = useState(true);

  // Al montar el componente, se obtienen los países
  useEffect(() => {
    getCountries()
      .then(countryNames => {
        // Guarda los nombres de los países y desactiva la carga
        setLocations(countryNames);
        setLoading(false);
      })
      .catch(error => {
        // Muestra error en consola y desactiva la carga
        console.error("Error al cargar ubicaciones:", error);
        setLoading(false);
      });
  }, []);

  // Si sigue cargando, muestra un mensaje
  if (loading) return <p>Cargando ubicaciones...</p>;

  return (
    <select
      className="form-select"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Selecciona una ubicación</option>
      {locations.map((loc, index) => (
        <option key={index} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  );
};

export default LocationSelect;
