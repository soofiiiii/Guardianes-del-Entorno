import React, { useState, useEffect } from "react";
import "./UserList.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10;
  const userId = 1; 

  // Función para cargar usuarios de la API
  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&userId=${userId}&page=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (data.users?.items) {
        // Mezclar la nueva página con lo que ya tenía
        setUsers((prev) => [...prev, ...data.users.items]);
        setTotalRecords(data.users.totalRecords || 0);
      } else {
        setError("No se encontraron usuarios.");
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al obtener los usuarios. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar la primera página al montar
  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line
  }, []);

  // Función para cargar más usuarios (siguiente página)
  const handleLoadMore = () => {
    // Solo si aún hay usuarios por cargar
    if (users.length < totalRecords) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  return (
    <>

    <Navbar />

    <div className="container mt-4">
      <h2 className="text-success text-center mb-4">Listado Completo de Usuarios</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            <h5 className="mb-1">{user.name}</h5>
            <p className="text-muted">{user.email}</p>
          </li>
        ))}
      </ul>

      {loading && <p className="text-center mt-3">Cargando...</p>}

      {/* Mostrar botón "Ver más" solo si faltan usuarios por cargar y no está cargando */}
      {!loading && users.length < totalRecords && (
        <button
          onClick={handleLoadMore}
          className="btn btn-secondary w-100 mt-3"
        >
          Ver más
        </button>
      )}
    </div>

    <Footer />

    </>
  );
}

export default UserList;
