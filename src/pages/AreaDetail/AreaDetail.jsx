import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext"; //   Importar contexto de autenticación
import { fetchNaturalAreaById } from '../../services/naturalAreaService';
import { fetchSpeciesByArea } from '../../services/speciesService';
import { fetchConservationActivitiesByArea } from '../../services/conservationActivityService';
import { fetchCommentsByEntity, addComment, updateComment, deleteComment } from "../../services/commentService";
import ModalInfo from '../../components/ModalInfo/ModalInfo';
import MapaInteractivo from '../../components/MapaInteractivo/MapaInteractivo';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './AreaDetail.css';

const AreaDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext); //  Obtener usuario autenticado
    const [mapCoords, setMapCoords] = useState({ lat: null, lng: null });

    // Estados del área, especies, actividades y errores
    const [area, setArea] = useState(null);
    const [species, setSpecies] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');

    // Estados de comentarios
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [editingComment, setEditingComment] = useState(null);
    const [loadingComments, setLoadingComments] = useState(false);

    // Estado para el modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState('');


    useEffect(() => {
        const getCoordinatesFromAddress = async (address) => {
            try {
                console.log("🔍 Buscando coordenadas para:", address);
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                );
                const data = await response.json();
    
                console.log("📍 Respuesta de Nominatim:", data);
    
                if (data.length > 0) {
                    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                }
    
                console.warn("⚠️ Nominatim no encontró coordenadas para:", address);
                return null;
            } catch (error) {
                console.error("❌ Error en Nominatim:", error);
                return null;
            }
        };
    
        const fetchData = async () => {
            try {
                //   Obtener datos del área
                const areaData = await fetchNaturalAreaById(id);
                setArea(areaData);
    
                console.log("📍 Datos completos del área recibidos:", areaData);
                console.log("🌍 Verificando coordenadas:", areaData.latitude, areaData.longitude);
    
                let lat = parseFloat(areaData.latitude);
                let lng = parseFloat(areaData.longitude);
    
                //  Si la API tiene `latitude` y `longitude`, los usamos directamente
                if (!isNaN(lat) && !isNaN(lng)) {
                    console.log("   Coordenadas válidas desde la API:", lat, lng);
                    setMapCoords({ lat, lng });
                    return;
                }
    
                console.warn("⚠️ Coordenadas no disponibles, buscando alternativa...");
    
                //  Intentar con la `region` primero 
                if (areaData.region) {
                    console.warn("🔄 Intentando obtener coordenadas desde la `region`...");
                    const regionCoords = await getCoordinatesFromAddress(`${areaData.region}, México`);
                    if (regionCoords) {
                        console.log("   Coordenadas obtenidas desde `region` en Nominatim:", regionCoords);
                        setMapCoords(regionCoords);
                        return;
                    }
                }
    
                //  Si la `region` no tiene coordenadas, intentar con la `location`
                if (areaData.location) {
                    console.warn("🔄 Intentando obtener coordenadas desde `location`...");
                    const locationCoords = await getCoordinatesFromAddress(areaData.location);
                    if (locationCoords) {
                        console.log("   Coordenadas obtenidas desde `location` en Nominatim:", locationCoords);
                        setMapCoords(locationCoords);
                        return;
                    }
                }
    
                //   Como último recurso, ubicar en `México`
                console.warn("⚠️ No se encontraron coordenadas específicas, usando `México` como ubicación.");
                const defaultCoords = await getCoordinatesFromAddress("México");
                setMapCoords(defaultCoords || null);
    
                //   Obtener especies de la API
                const speciesData = await fetchSpeciesByArea(id);
                setSpecies(speciesData.filter(specie => specie.naturalAreaId === parseInt(id)));
    
                //   Obtener actividades de conservación
                const activitiesData = await fetchConservationActivitiesByArea(id);
                setActivities(activitiesData);
    
                //   Cargar comentarios del área
                await loadComments();
            } catch (err) {
                console.error("❌ Error al cargar datos:", err);
                setError('No se pudo cargar el área.');
            }
        };
    
        fetchData();
    }, [id]);
    

    // Función para obtener comentarios del área
    const loadComments = async () => {
        try {
            const commentsData = await fetchCommentsByEntity(id, "naturalArea");
            setComments(commentsData);
        } catch (err) {
            console.error("❌ Error en loadComments:", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }
    
        if (!user?.id) {
            alert("Debes estar autenticado para comentar.");
            return;
        }
    
        const success = await addComment(user.id, id, "naturalArea", newComment, rating);
    
        if (success) {
            setNewComment(""); // Limpiar campo de texto
            setRating(5); // Reiniciar calificación
            loadComments(); // Volver a cargar comentarios
        } else {
            alert("No se pudo agregar el comentario. Intenta de nuevo.");
        }
    };
    

    const handleEdit = (comment) => {
        setNewComment(comment.text);
        setRating(comment.rating);
        setEditingComment(comment);
    };
    
    const handleUpdateComment = async () => {
        if (!editingComment) return;
    
        const success = await updateComment(
            editingComment.id, 
            user.id, 
            id, 
            "naturalArea",  // Cambia a "species" si es una especie
            newComment, 
            rating
        );
    
        if (success) {
            setEditingComment(null);
            setNewComment("");
            setRating(5);
            loadComments(); // Recargar comentarios después de la actualización
        } else {
            alert("No se pudo actualizar el comentario. Intenta de nuevo.");
        }
    };
    
    const handleDelete = async (commentId) => {
        if (!user?.id) {
            alert("Debes estar autenticado para eliminar un comentario.");
            return;
        }
    
        const success = await deleteComment(user.id, commentId);
    
        if (success) {
            loadComments(); // Recargar comentarios después de eliminar
        } else {
            alert("No se pudo eliminar el comentario. Intenta de nuevo.");
        }
    };
       
    

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!area) {
        return <div>Cargando...</div>;
    }

    return (
        <>
         <Navbar />
         
        <div className="area-detail-container">
           
            <h1>{area.name}</h1>

            {/* Imagen del área */}
            <img src={area.imageUrl} alt={area.name} className="area-image" />

            {/* Información general del área */}
            <div className="area-info">
                <p><strong>Ubicación:</strong> {area.location}</p>
                <p><strong>Tipo:</strong> {area.areaType}</p>
                <p><strong>Región:</strong> {area.region}</p>
                <p><strong>Estado de Conservación:</strong> {area.conservationStatus}</p>
                <p><strong>Descripción:</strong> {area.description}</p>
            </div>

            {/* Mapa Interactivo */}
            <h2 className="section-title">Ubicación en el Mapa</h2>
            {mapCoords ? (
                <MapaInteractivo lat={mapCoords.lat} lng={mapCoords.lng} areaName={area?.name} />
            ) : (
                <p style={{ textAlign: "center", color: "red" }}>Ubicación no disponible.</p>
            )}

            


            {/* Sección de especies */}
            <h2 className="section-title">Especies Avistadas</h2>
            {species.length > 0 ? (
                <div className="card-container">
                    {species.map((specie) => (
                        <div className="card" key={specie.id}>
                            <h4>{specie.commonName}</h4>
                            <button className="detail-button" onClick={() => { setSelectedItem(specie); setModalType('species'); }}>
                                Ver Detalles
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No se han registrado especies en esta área.</p>
            )}

            {/* Sección de actividades */}
            <h2 className="section-title">Actividades de Conservación</h2>
            {activities.length > 0 ? (
                <div className="card-container">
                    {activities.map((activity) => (
                        <div className="card" key={activity.id}>
                            <h4>{activity.description}</h4>
                            <p><strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                            <button className="detail-button" onClick={() => { setSelectedItem(activity); setModalType('activity'); }}>
                                Ver Detalles
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No se han registrado actividades de conservación en esta área.</p>
            )}

            {/* Sección de comentarios */}
            <h2 className="section-title">Comentarios</h2>
            {comments.length > 0 ? (
                <div className="comment-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-card">
                            <p><strong>Usuario {comment.userId}:</strong> {comment.text}</p>
                            <p><strong>Calificación:</strong> {comment.rating} ⭐</p>
                            {/* Botones de editar/eliminar solo si el comentario es del usuario autenticado */}
                            {comment.userId === user.id && (
                                <div className="comment-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(comment)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleDelete(comment.id)}>Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay comentarios en esta área.</p>
            )}


            {/* Formulario para agregar comentario */}
            <div className="comment-form">
                <h3>Agregar Comentario</h3>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="comment-textarea"
                />
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="rating-select">
                    <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 ⭐⭐⭐⭐</option>
                    <option value={3}>3 ⭐⭐⭐</option>
                    <option value={2}>2 ⭐⭐</option>
                    <option value={1}>1 ⭐</option>
                </select>
                <button className="submit-btn" onClick={editingComment ? handleUpdateComment : handleAddComment}>
                    {editingComment ? "Actualizar" : "Enviar"}
                </button>
            </div>


            {/* Modal para mostrar detalles */}
            <ModalInfo
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                data={selectedItem}
                type={modalType}
            />
           
        </div>

        <Footer />
        </>
    );
};

export default AreaDetail;
