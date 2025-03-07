import React, { useState, useEffect } from 'react';
import { listAllNaturalAreas } from '../../services/naturalAreaService';
import './Posts.css'; 
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


const Posts = () => {
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const data = await listAllNaturalAreas(page, pageSize);
        console.log('Respuesta de la API:', JSON.stringify(data, null, 2));
        
        // Usamos la propiedad "items" (o "Items" o "data")
        const areasList = data.Items || data.items || data.data;
        
        if (areasList && Array.isArray(areasList)) {
          setAreas((prev) => [...prev, ...areasList]);
          setTotalRecords(data.TotalRecords || data.totalRecords || 0);
        } else {
          setError(data.Message || data.message || 'No se pudieron cargar las áreas.');
        }
      } catch (err) {
        console.error('Error al conectar con la API:', err);
        setError('Error al conectar con la API.');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [page]);

  const handleLoadMore = () => {
    if (areas.length < totalRecords) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>

    < Navbar />
    <div className="posts-container">
      <h2>Todas las Publicaciones</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="posts-grid">
        {areas.map((area) => (
          <div key={area.id} className="post-card">
            <img src={area.imageUrl} alt={area.name} className="post-image" />
            <h3>{area.name}</h3>
            <p>{area.location}</p>
            <p>{area.description}</p>
          </div>
        ))}
      </div>

      {loading && <p>Cargando...</p>}
      {!loading && areas.length < totalRecords && (
        <button onClick={handleLoadMore}>Ver más</button>
      )}
    </div>

      < Footer />
    </>
  );
};

export default Posts;
