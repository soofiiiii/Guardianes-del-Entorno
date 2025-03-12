import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchSpeciesByUser, updateSpecies } from "../../services/speciesService";
import Navbar from "../../components/Navbar/Navbar";

const EditSpecies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { speciesId } = useParams(); // Obtener ID desde la URL

  const [formData, setFormData] = useState({
    commonName: "",
    scientificName: "",
    category: "",
    conservationStatus: "",
    naturalAreaId: null, // No se modificará
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ** Cargar los datos de la especie **
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const speciesData = await fetchSpeciesByUser(user.id); // Obtener especies del usuario
        const selectedSpecies = speciesData.find((sp) => sp.id === Number(speciesId));

        if (!selectedSpecies) {
          throw new Error("No se encontró la especie.");
        }

        // Cargar datos en el formulario
        setFormData({
          commonName: selectedSpecies.commonName,
          scientificName: selectedSpecies.scientificName,
          category: selectedSpecies.category,
          conservationStatus: selectedSpecies.conservationStatus,
          naturalAreaId: selectedSpecies.naturalAreaId, // No se podrá modificar
        });

      } catch (err) {
        console.error("Error al cargar la especie:", err);
        setError("No se pudo cargar la especie.");
      } finally {
        setLoading(false);
      }
    };

    if (speciesId) {
      loadSpecies();
    }
  }, [speciesId, user.id]);

  // ** Manejo de cambios en los campos del formulario **
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ** Enviar formulario para actualizar la especie **
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const payload = {
        userId: user.id,
        species: {
          id: speciesId, // ID de la especie a actualizar
          commonName: formData.commonName,
          scientificName: formData.scientificName,
          category: formData.category,
          conservationStatus: formData.conservationStatus,
          naturalAreaId: formData.naturalAreaId, // Se mantiene sin cambios
        },
      };

      console.log("Enviando actualización:", JSON.stringify(payload, null, 2));

      const response = await updateSpecies(payload);

      if (response && (response.Success || response.result)) {
        setSuccessMessage("Especie actualizada exitosamente.");
        navigate("/dashboard");
      } else {
        setError(response?.Message || "No se pudo actualizar la especie.");
      }
    } catch (err) {
      console.error("Error en updateSpecies:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando especie...</p>;
  if (error) return <p className="alert alert-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Editar Especie</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre Común</label>
            <input
              type="text"
              className="form-control"
              name="commonName"
              value={formData.commonName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nombre Científico</label>
            <input
              type="text"
              className="form-control"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Estado de Conservación</label>
            <select
              className="form-select"
              name="conservationStatus"
              value={formData.conservationStatus}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="En peligro">En peligro</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="Estable">Estable</option>
            </select>
          </div>

          {/* **Área Natural (No modificable)** */}
          <div className="mb-3">
            <label className="form-label">Área Natural</label>
            <input
              type="text"
              className="form-control"
              value={`Área ID: ${formData.naturalAreaId}`}
              disabled
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSpecies;
