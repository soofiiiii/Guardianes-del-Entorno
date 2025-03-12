import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { listUserNaturalAreas, updateNaturalArea } from "../../services/naturalAreaService";
import Navbar from "../../components/Navbar/Navbar";


const EditArea = () => {
  const { areaId } = useParams(); // ID basado en localStorage
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadArea = async () => {
      try {
        console.log(" ID recibido en EditArea desde localStorage:", areaId);

        if (!areaId) {
          setError("ID del área no es válido.");
          setLoading(false);
          return;
        }

        // Obtener áreas guardadas en localStorage
        const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};
        console.log(" Publicaciones guardadas en localStorage:", storedPublications);

        const userAreas = storedPublications[user.id] || [];
        console.log(" Áreas del usuario en localStorage:", JSON.stringify(userAreas, null, 2));

        if (!Array.isArray(userAreas) || userAreas.length === 0) {
          setError("No hay áreas guardadas en localStorage.");
          setLoading(false);
          return;
        }

        //  Buscar el área en localStorage por NOMBRE
        const localArea = userAreas.find(area => 
          area.name && area.name.toLowerCase().trim() === areaId.toLowerCase().trim()
        );

        if (!localArea) {
          setError("No se encontró el área en localStorage.");
          setLoading(false);
          return;
        }

        console.log(" Área encontrada en localStorage:", localArea);

        //  Obtener la lista de áreas desde la API
        const apiResponse = await listUserNaturalAreas(user.id); // Filtra por usuario
        if (!apiResponse || !apiResponse.items || apiResponse.items.length === 0) {
          setError("La API no devolvió áreas.");
          setLoading(false);
          return;
        }

        console.log(" Áreas obtenidas desde la API:", apiResponse.items);

        // Buscar el área en la API por nombre
        const apiArea = apiResponse.items.find(area => 
            area.name.trim().toLowerCase() === localArea.name.trim().toLowerCase() ||
            area.location.trim().toLowerCase() === localArea.location.trim().toLowerCase()
        );
        

        if (!apiArea) {
          setError("El ID del área no está definido en la API.");
          setLoading(false);
          return;
        }

        console.log(" Área encontrada en API:", apiArea);

        //  Actualizar el formData con los datos reales de la API
        setFormData({
          id: apiArea.id,
          name: apiArea.name,
          location: apiArea.location,
          areaType: apiArea.areaType,
          region: apiArea.region,
          conservationStatus: apiArea.conservationStatus,
          description: apiArea.description
        });

        setLoading(false);
      } catch (err) {
        console.error(" Error al cargar el área:", err);
        setError("No se pudo cargar el área.");
        setLoading(false);
      }
    };

    loadArea();
  }, [areaId, user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            console.log("🔹 Datos actuales en formData:", formData);

            if (!formData.id) {
                throw new Error("El ID del área no está definido.");
            }

            const payload = {
                userId: user.id,
                naturalArea: {
                    id: Number(formData.id),  // Convertir a número
                    name: formData.name,
                    location: formData.location,
                    areaType: formData.areaType,
                    region: formData.region,
                    conservationStatus: formData.conservationStatus,
                    description: formData.description,
                    imageUrl: formData.imageUrl || "" // Agregar imageUrl, evitar que sea undefined
                }
            };

            console.log(" Enviando payload de actualización:", JSON.stringify(payload, null, 2));

            const response = await updateNaturalArea(payload);
            console.log(" Respuesta de la API:", response);

            if (response) {
                //  Actualizar en el localStorage
                const storedPublications = JSON.parse(localStorage.getItem("misPublicaciones")) || {};
                const userAreas = storedPublications[user.id] || [];

                // Encontrar el área en el localStorage y actualizarla
                const updatedAreas = userAreas.map(area => 
                    area.id === formData.id ? { ...area, ...formData } : area
                );

                // Guardar los cambios en localStorage
                storedPublications[user.id] = updatedAreas;
                localStorage.setItem("misPublicaciones", JSON.stringify(storedPublications));

                console.log(" Área actualizada en localStorage:", updatedAreas);

                setSuccessMessage("Área actualizada correctamente.");
                navigate("/dashboard");
            } else {
                throw new Error("No se pudo actualizar el área.");
            }
        } catch (error) {
            console.error(" Error al actualizar el área:", error.message);
            setError("No se pudo actualizar el área.");
        }
    };



  if (loading) return <p className="text-center mt-4">Cargando área...</p>;
  if (error) return <p className="alert alert-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Editar Área</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Guardar Cambios
          </button>
        </form>
      </div>
    </>
  );
};

export default EditArea;
