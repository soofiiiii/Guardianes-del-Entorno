import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { listAllNaturalAreas } from '../../services/naturalAreaService';
import { listAllSpecies } from '../../services/speciesService';
import { fetchConservationActivitiesByArea } from '../../services/conservationActivityService';
import './Home.css';
import entornoImage from '../../assets/img/entorno.png';


const Home = () => {
  // Estado para definir qué sección se muestra (por defecto "areas")
  const [activeSearch, setActiveSearch] = useState('areas');

  // Estados para áreas naturales
  const [areas, setAreas] = useState([]);
  const [areaFilters, setAreaFilters] = useState({
    keyword: '',
    areaType: '',
    region: '',
    conservationStatus: ''
  });
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [errorAreas, setErrorAreas] = useState('');

  // Estados para especies avistadas
  const [species, setSpecies] = useState([]);
  const [speciesFilters, setSpeciesFilters] = useState({
    keyword: '',
    category: '',
    conservationStatus: '',
    naturalAreaId: ''
  });
  const [loadingSpecies, setLoadingSpecies] = useState(false);
  const [errorSpecies, setErrorSpecies] = useState('');

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [errorActivities, setErrorActivities] = useState('');

  // Carga inicial de áreas (se cargan por defecto)
  useEffect(() => {
    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const data = await listAllNaturalAreas(1, 100);
        setAreas(data.items || data.Items || []);
      } catch (err) {
        console.error('Error al cargar áreas:', err);
        setErrorAreas('Error al cargar las áreas.');
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, []);

  // Carga de especies solo si el usuario selecciona la pestaña "Especies"
  useEffect(() => {
    if (activeSearch === 'species' && species.length === 0) {
      const fetchSpecies = async () => {
        setLoadingSpecies(true);
        try {
          const data = await listAllSpecies(1, 100);
          setSpecies(data.items || data.Items || []);
        } catch (err) {
          console.error('Error al cargar especies:', err);
          setErrorSpecies('Error al cargar las especies.');
        } finally {
          setLoadingSpecies(false);
        }
      };
      fetchSpecies();
    }
  }, [activeSearch, species.length]);
  

  // Filtrado de áreas basado en areaFilters
  const filteredAreas = areas.filter((area) => {
    return (
      (areaFilters.keyword === '' ||
        area.name.toLowerCase().includes(areaFilters.keyword.toLowerCase())) &&
      (areaFilters.areaType === '' || area.areaType === areaFilters.areaType) &&
      (areaFilters.region === '' ||
        area.region.toLowerCase().includes(areaFilters.region.toLowerCase())) &&
      (areaFilters.conservationStatus === '' ||
        area.conservationStatus === areaFilters.conservationStatus)
    );
  });

  // Filtrado de especies basado en speciesFilters
  const filteredSpecies = species.filter((specie) => {
    return (
      (speciesFilters.keyword === '' ||
        specie.commonName.toLowerCase().includes(speciesFilters.keyword.toLowerCase()) ||
        specie.scientificName.toLowerCase().includes(speciesFilters.keyword.toLowerCase())) &&
      (speciesFilters.category === '' || specie.category === speciesFilters.category) &&
      (speciesFilters.conservationStatus === '' || specie.conservationStatus === speciesFilters.conservationStatus) &&
      (speciesFilters.naturalAreaId === '' ||
        specie.naturalAreaId.toString() === speciesFilters.naturalAreaId)
    );
  });

  // Manejo de cambios en filtros para áreas
  const handleAreaFilterChange = (e) => {
    const { name, value } = e.target;
    setAreaFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de cambios en filtros para especies
  const handleSpeciesFilterChange = (e) => {
    const { name, value } = e.target;
    setSpeciesFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="home-container">
      <Navbar />

      {/* Sección Hero */}
      <header className="hero-section d-flex align-items-center">
        <div className="container text-center text-md-start">
          <div className="row">
            <div className="col-md-6">
              <h1 className="hero-title text-white fw-bold">
                Guardianes del Entorno
              </h1>
              <p className="hero-subtitle text-white-50">
                Únete a nuestra comunidad y descubre cómo proteger la naturaleza.
              </p>
              <Link to="/registro" className="btn btn-success btn-lg mt-3 shadow-sm">
                Registrarme
              </Link>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
            <img
              src={entornoImage}
              alt="Ilustración de entorno"
              className="img-fluid rounded"
            />

            </div>
          </div>
        </div>
      </header>

      {/* Barra de navegación para búsqueda entre Áreas, Especies o Actividades */}
      <nav className="search-navbar my-4">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeSearch === 'areas' ? 'active' : ''}`}
              onClick={() => setActiveSearch('areas')}
            >
              Áreas
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeSearch === 'species' ? 'active' : ''}`}
              onClick={() => setActiveSearch('species')}
            >
              Especies
            </button>
          </li>

        </ul>
      </nav>

      {/* Renderizado condicional según la pestaña seleccionada */}
      {activeSearch === 'areas' && (
        <section className="areas-section py-5 bg-white">
          <div className="container">
            <h2>Áreas Naturales</h2>
            <div className="area-filters mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre o palabra clave"
                name="keyword"
                value={areaFilters.keyword}
                onChange={handleAreaFilterChange}
                className="form-control mb-2"
              />
              <select
                name="areaType"
                value={areaFilters.areaType}
                onChange={handleAreaFilterChange}
                className="form-select mb-2"
              >
                <option value="">Tipo de Área</option>
                <option value="Parque Nacional">Parque Nacional</option>
                <option value="Reserva Natural">Reserva Natural</option>
                <option value="Sitio Urbano">Sitio Urbano</option>
              </select>
              <input
                type="text"
                placeholder="Región o País"
                name="region"
                value={areaFilters.region}
                onChange={handleAreaFilterChange}
                className="form-control mb-2"
              />
              <select
                name="conservationStatus"
                value={areaFilters.conservationStatus}
                onChange={handleAreaFilterChange}
                className="form-select"
              >
                <option value="">Estado de Conservación</option>
                <option value="Crítico">Crítico</option>
                <option value="En riesgo">En riesgo</option>
                <option value="Estable">Estable</option>
              </select>
            </div>

            {loadingAreas ? (
              <p>Cargando áreas...</p>
            ) : errorAreas ? (
              <p className="alert alert-danger">{errorAreas}</p>
            ) : (
              <div className="row">
                {filteredAreas.map((area) => (
                  <div className="col-md-4" key={area.id}>
                  <div className="card mb-3">
                    <img src={area.imageUrl} className="card-img-top" alt={area.name} />
                    <div className="card-body">
                      <h5 className="card-title">{area.name}</h5>
                      <p className="card-text">{area.location}</p>
                      <p className="card-text">{area.description}</p>
                      <Link to={`/area/${area.id}`} className="btn btn-outline-success">
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeSearch === 'species' && (
        <section className="species-section py-5 bg-light">
          <div className="container">
            <h2>Especies Avistadas</h2>
            <div className="species-filters mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre (común o científico)"
                name="keyword"
                value={speciesFilters.keyword}
                onChange={handleSpeciesFilterChange}
                className="form-control mb-2"
              />
              <select
                name="category"
                value={speciesFilters.category}
                onChange={handleSpeciesFilterChange}
                className="form-select mb-2"
              >
                <option value="">Categoría</option>
                <option value="Mamífero">Mamífero</option>
                <option value="Ave">Ave</option>
                <option value="Planta">Planta</option>
              </select>
              <select
                name="conservationStatus"
                value={speciesFilters.conservationStatus}
                onChange={handleSpeciesFilterChange}
                className="form-select mb-2"
              >
                <option value="">Estado de Conservación</option>
                <option value="En peligro">En peligro</option>
                <option value="Vulnerable">Vulnerable</option>
                <option value="Estable">Estable</option>
              </select>
              <input
                type="text"
                placeholder="Área Natural"
                name="naturalAreaId"
                value={speciesFilters.naturalAreaId}
                onChange={handleSpeciesFilterChange}
                className="form-control"
              />
            </div>

            {loadingSpecies ? (
              <p>Cargando especies...</p>
            ) : errorSpecies ? (
              <p className="alert alert-danger">{errorSpecies}</p>
            ) : (
              <div className="row">
                {filteredSpecies.map((specie) => (
                  <div className="col-md-4" key={specie.id}>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{specie.commonName}</h5>
                      <p className="card-text">{specie.scientificName}</p>
                      <p className="card-text">{specie.category}</p>
                      <p className="card-text">{specie.conservationStatus}</p>
                      <Link to={`/area/${specie.naturalAreaId}`} className="btn btn-outline-success">
                        Ver área
                      </Link>
                    </div>
                  </div>
                </div>                
                ))}
              </div>
            )}
          </div>
        </section>
      )}



      <Footer />
    </div>
  );
};

export default Home;
