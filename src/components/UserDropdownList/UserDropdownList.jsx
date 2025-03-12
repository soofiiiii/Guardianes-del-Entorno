import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserDropdownList.css"

const UserDropdownList = () => {
  // Array con todos los usuarios
  const [users, setUsers] = useState([]);
  // Array con usuarios filtrados según el término de búsqueda
  const [filteredUsers, setFilteredUsers] = useState([]);
  // Término de búsqueda ingresado
  const [searchTerm, setSearchTerm] = useState("");
  // Estado de carga
  const [loading, setLoading] = useState(false);
  // Mensaje de error
  const [error, setError] = useState("");

  // Cargar todos los usuarios de la API al montar el componente
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        let allUsers = [];
        let currentPage = 1;
        let totalPages = 1;

        // Recorrer todas las páginas hasta obtener todos los usuarios
        while (currentPage <= totalPages) {
          const response = await fetch(
            `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&page=${currentPage}&pageSize=10`,
            { headers: { "ngrok-skip-browser-warning": "true" } }
          );

          if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          if (!data.users || !data.users.items.length) {
            throw new Error("No se encontraron usuarios.");
          }

          allUsers = [...allUsers, ...data.users.items];
          totalPages = data.users.totalPages || 1;
          currentPage++;
        }

        setUsers(allUsers);
        setFilteredUsers(allUsers); // Mostrar todos los usuarios inicialmente
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Filtrar usuarios en tiempo real según el término de búsqueda
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="d-flex align-items-center position-relative">
      {/* Barra de búsqueda */}
      <input
        type="text"
        className="form-control me-2"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "250px" }}
      />

      {/* Lista desplegable con resultados de búsqueda */}
      {searchTerm.length > 0 && (
        <ul
          className="dropdown-menu show position-absolute w-100"
          style={{ maxHeight: "300px", overflowY: "auto", top: "100%" }}
        >
          {loading ? (
            <li className="dropdown-item text-center text-muted">
              Cargando usuarios...
            </li>
          ) : error ? (
            <li className="dropdown-item text-danger text-center">{error}</li>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.id}>
                <Link to={`/perfil/${user.id}`} className="dropdown-item d-flex align-items-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="rounded-circle me-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                  ) : (
                    <span className="me-2">👤</span> // Icono si no hay imagen
                  )}
                  <strong>{user.name}</strong>
                </Link>
              </li>
            ))
          ) : (
            <li className="dropdown-item text-muted text-center">
              No se encontraron resultados.
            </li>
          )}

          {/* Botón para ver más usuarios */}
          <li className="text-center mt-2">
            <Link className="btn btn-sm btn-outline-success w-100" to="/user-list">
              Ver más
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdownList;
