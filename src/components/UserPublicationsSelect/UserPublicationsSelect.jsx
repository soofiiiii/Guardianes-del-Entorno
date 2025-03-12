import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Componente para seleccionar un área de publicación
const UserPublicationsSelect = ({ onSelect, setFormData }) => {
  // Obtiene las áreas del usuario desde el contexto de autenticación
  const { myAreas } = useContext(AuthContext);
  // Estado para guardar las áreas obtenidas de la API
  const [areasFromAPI, setAreasFromAPI] = useState([]);

  // Al montar el componente, se obtienen las áreas desde la API
  useEffect(() => {
    const fetchAreasFromAPI = async () => {
      try {
        // Hace la petición a la API para obtener las áreas naturales
        const response = await fetch(
          "https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&Keyword=&AreaType=&Region=&ConservationStatus=&Page=1&PageSize=1000"
        );

        // Verifica si la respuesta es exitosa
        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

        // Convierte la respuesta a JSON
        const data = await response.json();
        console.log("Áreas obtenidas de la API:", data.items);

        // Guarda las áreas en el estado
        setAreasFromAPI(data.items || []);
      } catch (error) {
        console.error("Error al obtener áreas desde la API:", error);
      }
    };

    fetchAreasFromAPI();
  }, []);

  // Función que maneja la selección de un área
  const handleAreaSelect = (selectedName) => {
    // Si aún no se han cargado las áreas de la API, muestra un aviso
    if (!areasFromAPI.length) {
      console.warn("No se han cargado las áreas de la API todavía.");
      return;
    }

    // Función para normalizar textos (quita acentos, espacios extras y pasa a minúsculas)
    const normalize = (str) =>
      str
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    console.log("Buscando en API el área con nombre:", selectedName);

    // Busca una coincidencia exacta en la lista de áreas
    let matchedArea = areasFromAPI.find(
      (apiArea) => normalize(apiArea.name) === normalize(selectedName)
    );

    // Si no encuentra una coincidencia exacta, intenta una coincidencia parcial
    if (!matchedArea) {
      console.warn("No se encontró coincidencia exacta, probando coincidencia parcial...");
      matchedArea = areasFromAPI.find(
        (apiArea) =>
          normalize(apiArea.name).includes(normalize(selectedName)) ||
          normalize(selectedName).includes(normalize(apiArea.name))
      );
    }

    // Si se encuentra un área, actualiza el formulario y llama al callback onSelect
    if (matchedArea) {
      console.log("Área seleccionada:", matchedArea.name, "ID encontrada:", matchedArea.id);
      setFormData((prevState) => ({
        ...prevState,
        naturalAreaId: Number(matchedArea.id),
      }));
      onSelect(Number(matchedArea.id));
    } else {
      // Si no se encuentra el área, muestra una advertencia y resetea el valor
      console.warn("No se encontró un área con el nombre:", selectedName);
      setFormData((prevState) => ({
        ...prevState,
        naturalAreaId: null,
      }));
      onSelect(null);
    }
  };

  return (
    <div className="mb-3">
      {/* Etiqueta del campo */}
      <label className="form-label">Área Natural Asociada</label>
      {/* Select para elegir el área */}
      <select className="form-select" onChange={(e) => handleAreaSelect(e.target.value)} required>
        <option value="">Selecciona un área</option>
        {/* Muestra las áreas del usuario si existen */}
        {myAreas.length > 0 ? (
          myAreas.map((area, index) => (
            <option key={index} value={area.name}>
              {area.name}
            </option>
          ))
        ) : (
          <option value="">No hay publicaciones</option>
        )}
      </select>
    </div>
  );
};

export default UserPublicationsSelect;
