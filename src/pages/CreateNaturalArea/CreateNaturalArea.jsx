import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { createNaturalArea, updateNaturalArea, fetchNaturalAreaById } from "../../services/naturalAreaService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LocationSelect from "../../components/LocationSelect/LocationSelect";
import "./CreateNaturalArea.css";

const CreateNaturalArea = () => {
  const { user, addArea } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID de la publicación si se está editando

  //  Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    areaType: "",
    region: "",
    conservationStatus: "",
    description: "",
    imageUrl: "",
  });

  // Estado para manejar especies
  const [speciesList, setSpeciesList] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); //   Determinar si es edición

  const [imageFile, setImageFile] = useState(null); // Archivo seleccionado
  const [uploading, setUploading] = useState(false); // Estado de carga

  //   Cargar datos desde la API si es una edición
  useEffect(() => {
    if (!id || !user) return;
  
    console.log("  ID recibido en useParams:", id);
    console.log("  Publicaciones en localStorage:", JSON.parse(localStorage.getItem("misPublicaciones")));
  
    const fetchAreaData = async () => {
      try {
        setLoading(true);
        
        //   Obtener área desde la API
        const areaToEdit = await fetchNaturalAreaById(id);
        console.log("  Datos recibidos de la API:", areaToEdit);
  
        if (areaToEdit) {
          setFormData({
            name: areaToEdit.name || "",
            location: areaToEdit.location || "",
            areaType: areaToEdit.areaType || "",
            region: areaToEdit.region || "",
            conservationStatus: areaToEdit.conservationStatus || "",
            description: areaToEdit.description || "",
            imageUrl: areaToEdit.imageUrl || "",
          });
  
          setSpeciesList(areaToEdit.species || []);
          setIsEditing(true);
        } else {
          setError("No se encontró la publicación en la API.");
        }
      } catch (err) {
        console.error("  Error al cargar el área:", err);
        setError("Error al obtener los datos del área.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAreaData();
  }, [id, user]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   Añadir especie
  const handleAddSpecies = () => {
    setSpeciesList((prev) => [...prev, {}]);
  };

  //   Modificar especie
  const handleSpeciesChange = (index, newSpeciesData) => {
    setSpeciesList((prev) =>
      prev.map((specie, i) => (i === index ? newSpeciesData : specie))
    );
  };

  //   Eliminar especie
  const handleRemoveSpecies = (index) => {
    setSpeciesList((prev) => prev.filter((_, i) => i !== index));
  };

  //   Guardar/Modificar publicación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    if (!user) {
      setError("Debes iniciar sesión para continuar.");
      return;
    }
  
    setLoading(true);
  
    const payload = {
      userId: user.id,
      naturalArea: { ...formData, species: speciesList },
    };
  
    try {
      let data;
  
      if (isEditing) {
        //   Asegurar que el ID está presente antes de modificar
        if (!id) {
          throw new Error("  ID de publicación inválido.");
        }
        
        payload.naturalArea.id = Number(id); // Forzar conversión a número
        console.log("🔄 Enviando actualización a la API con ID:", id);
        
        data = await updateNaturalArea(payload);
      } else {
        console.log("🚀 Creando nueva publicación en la API...");
        data = await createNaturalArea(payload);
      }
  
      if (data.result || data.Success) {
        setSuccessMessage(isEditing ? "Área natural modificada correctamente." : "Área natural creada correctamente.");
  
        //   Obtener ID desde API si es una nueva creación
        const updatedArea = {
          ...data.area,
          ...formData,
          id: isEditing ? Number(id) : data.area?.id || data.id,
          species: speciesList,
          userId: user.id,
        };
  
        console.log("  ID final de la publicación:", updatedArea.id);
  
        //   Guardar en `localStorage`
        const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};
        let userPublications = storedPublications[user.id] || [];
  
        if (isEditing) {
          //   Reemplazar la publicación existente
          userPublications = userPublications.map((area) =>
            area.id === Number(id) ? updatedArea : area
          );
        } else {
          //   Agregar una nueva publicación
          userPublications.push(updatedArea);
        }
  
        storedPublications[user.id] = userPublications;
        localStorage.setItem("misPublicaciones", JSON.stringify(storedPublications));
  
        console.log("  Publicaciones guardadas en localStorage:", storedPublications);
  
        navigate("/dashboard");
      } else {
        setError(data.Message || "No se pudo completar la acción.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2>{isEditing ? "Modificar Área Natural" : "Crear Área Natural"}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <LocationSelect name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de Área</label>
            <input type="text" className="form-control" name="areaType" value={formData.areaType} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Región</label>
            <input type="text" className="form-control" name="region" value={formData.region} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Estado de Conservación</label>
            <select className="form-select" name="conservationStatus" value={formData.conservationStatus} onChange={handleChange} required>
              <option value="">Selecciona</option>
              <option value="Crítico">Crítico</option>
              <option value="En riesgo">En riesgo</option>
              <option value="Estable">Estable</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">URL de la Imagen</label>
            <input type="url" className="form-control" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </div>
          

          <button type="submit" className="btn btn-success mt-3" disabled={loading}>
            {loading ? "Procesando..." : isEditing ? "Modificar Área Natural" : "Crear Área Natural"}
          </button>
        </form>

        <Footer />
      </div>
    </>
  );
};

export default CreateNaturalArea;
