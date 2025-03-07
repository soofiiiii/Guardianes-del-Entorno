import React, { useState, useEffect } from 'react';
import { getCountries } from '../../services/countriesService';


const LocationSelect = ({ name, value, onChange, required }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountries()
      .then(countryNames => {
        setLocations(countryNames);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar ubicaciones:", error);
        setLoading(false);
      });
  }, []);

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
