import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importamos Link para redirigir al perfil del usuario
import "./UserList.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function UserList() {
  const [users, setUsers] = useState([]); // Usuarios actualmente listados
  const [allUsers, setAllUsers] = useState([]); // Todos los usuarios para la búsqueda
  const [filteredUsers, setFilteredUsers] = useState([]); // Lista filtrada por búsqueda
  const [searchTerm, setSearchTerm] = useState(""); // Texto de búsqueda
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Función para cargar 20 usuarios progresivamente
  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&page=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.users || !data.users.items.length) {
        throw new Error("No se encontraron usuarios.");
      }

      // Agregar nuevos usuarios a la lista sin duplicados
      setUsers((prev) => [...prev, ...data.users.items]);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar TODOS los usuarios para la búsqueda
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&page=1&pageSize=1000`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.users || !data.users.items.length) {
        throw new Error("No se encontraron usuarios.");
      }

      setAllUsers(data.users.items); // Almacenar todos los usuarios para búsqueda
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  // Cargar los primeros 20 usuarios
  useEffect(() => {
    fetchUsers(page);
    fetchAllUsers();
  }, []);

  // Filtrar usuarios en tiempo real desde la lista completa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users); // Mostrar solo los usuarios cargados si el buscador está vacío
    } else {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, allUsers]);

  // Manejar la carga de más usuarios
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchUsers(page + 1);
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="text-success text-center mb-4">Listado de Usuarios</h2>

        {/* Barra de búsqueda */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <ul className="list-group">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <li key={`${user.id}-${index}`} className="list-group-item">
                <Link to={`/perfil/${user.id}`} className="user-link">
                  <h5 className="mb-1">{user.name}</h5>
                </Link>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">No se encontraron resultados.</li>
          )}
        </ul>

        {/* Botón "Ver más" para cargar más usuarios */}
        {!searchTerm && users.length > 0 && (
          <button onClick={handleLoadMore} className="btn btn-secondary w-100 mt-3">
            Ver más
          </button>
        )}

        {loading && <p className="text-center mt-3">Cargando...</p>}
      </div>

      <Footer />
    </>
  );
}

export default UserList;
