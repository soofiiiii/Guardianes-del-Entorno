import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { fetchNaturalAreaById } from '../../services/naturalAreaService';
import { fetchSpeciesByArea } from '../../services/speciesService';
import { fetchConservationActivitiesByArea } from '../../services/conservationActivityService';
import { fetchCommentsByEntity, updateComment, deleteComment } from "../../services/commentService";
import ModalInfo from '../../components/ModalInfo/ModalInfo';
import MapaInteractivo from '../../components/MapaInteractivo/MapaInteractivo';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AreaInfo from '../../components/AreaInfo/AreaInfo';
import SpeciesList from '../../components/SpeciesList/SpeciesList';
import ActivitiesList from '../../components/ActivitiesList/ActivitiesList';
import CommentsSection from '../../components/CommentsSection/CommentsSection';
import './AreaDetail.css';

const getCoordinatesFromAddress = async (address) => {
    try {
        console.log(" Buscando coordenadas para:", address);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();

        console.log(" Respuesta de Nominatim:", data);

        if (data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }

        console.warn(" Nominatim no encontró coordenadas para:", address);
        return null;
    } catch (error) {
        console.error(" Error en Nominatim:", error);
        return null;
    }
};

const AreaDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [mapCoords, setMapCoords] = useState(null);
    const [area, setArea] = useState(null);
    const [species, setSpecies] = useState([]);
    const [activities, setActivities] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(" Cargando datos del área con ID:", id);

                const areaData = await fetchNaturalAreaById(id);
                console.log(" Datos completos del área recibidos:", areaData);

                setArea(areaData);

                let lat = parseFloat(areaData.latitude);
                let lng = parseFloat(areaData.longitude);

                console.log(" Coordenadas obtenidas de la API:", lat, lng);

                if (isNaN(lat) || isNaN(lng)) {
                    console.warn(" No se encontraron coordenadas en la API, intentando obtenerlas desde `location`...");
                    if (areaData.location) {
                        const coords = await getCoordinatesFromAddress(areaData.location);
                        if (coords) {
                            lat = coords.lat;
                            lng = coords.lng;
                        }
                    }
                }

                if (!isNaN(lat) && !isNaN(lng)) {
                    setMapCoords({ lat, lng });
                    console.log(" Coordenadas asignadas correctamente:", lat, lng);
                } else {
                    console.warn(" No se pudieron obtener coordenadas.");
                }

                //  Obtención de especies
                const speciesData = await fetchSpeciesByArea(id);
                console.log(" Especies obtenidas de la API:", speciesData);

                setSpecies(speciesData || []);

                // Obtención de actividades
                const activitiesData = await fetchConservationActivitiesByArea(id);
                console.log(" Actividades obtenidas:", activitiesData);

                setActivities(activitiesData || []);

                // Obtención de comentarios
                const commentsData = await fetchCommentsByEntity(id, "naturalArea");
                console.log(" Comentarios obtenidos:", commentsData);

                setComments(commentsData || []);
            } catch (err) {
                console.error(" Error al cargar datos:", err);
                setError('No se pudo cargar el área.');
            }
        };

        fetchData();
    }, [id]);

    const handleEditComment = async (commentId, newText, newRating) => {
        if (!user?.id) return;
    
        const success = await updateComment(commentId, user.id, id, "naturalArea", newText, newRating);
        if (success) {
            const updatedComments = await fetchCommentsByEntity(id, "naturalArea");
            setComments(updatedComments);
        } else {
            alert(" No se pudo actualizar el comentario.");
        }
    };
    
    const handleDeleteComment = async (commentId) => {
        if (!user?.id) return;
    
        const success = await deleteComment(user.id, commentId);
        if (success) {
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } else {
            alert(" No se pudo eliminar el comentario.");
        }
    };
    

    return (
        <>
            <Navbar />
            <div className="area-detail-container">
                {/* Información general del área */}
                <AreaInfo area={area} />

                {/* Mapa interactivo */}
                <h2 className="section-title">Ubicación en el Mapa</h2>
                {mapCoords ? (
                    <MapaInteractivo lat={mapCoords.lat} lng={mapCoords.lng} areaName={area?.name} />
                ) : (
                    <p style={{ textAlign: "center", color: "red" }}> Ubicación no disponible.</p>
                )}

                {/* Lista de especies */}
                <SpeciesList species={species} onSelect={(item, type) => { setSelectedItem(item); setModalType(type); }} />

                {/* Lista de actividades de conservación */}
                <ActivitiesList activities={activities} onSelect={(item, type) => { setSelectedItem(item); setModalType(type); }} />

                {/* Sección de comentarios */}
                <CommentsSection 
                    comments={comments} 
                    user={user} 
                    onAdd={() => {}} 
                    onEdit={handleEditComment} 
                    onDelete={handleDeleteComment} 
                />

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
