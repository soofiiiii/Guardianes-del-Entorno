import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserProfile.css";
import Navbar from "../../components/Navbar/Navbar";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]); // Lista de publicaciones filtradas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || isNaN(Number(userId))) {
        setError("ID de usuario no válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Buscando usuario con ID: ${userId}`);

        // Obtener usuario específico desde la API
        const userResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/user/list?secret=TallerReact2025!&page=1&pageSize=1000`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );

        if (!userResponse.ok) throw new Error("Error al obtener usuarios.");
        const userData = await userResponse.json();

        if (!userData.users || !userData.users.items.length)
          throw new Error("No se encontraron usuarios.");

        // Buscar el usuario específico
        const user = userData.users.items.find((u) => u.id === Number(userId));
        if (!user) throw new Error("Usuario no encontrado.");

        setUserData(user);
        console.log("Usuario encontrado:", user);

        // Obtener publicaciones filtradas por usuario
        console.log(` Cargando publicaciones del usuario ${userId}...`);
        const postsResponse = await fetch(
          `https://mammal-excited-tarpon.ngrok-free.app/api/natural-area/list?secret=TallerReact2025!&userId=${userId}&page=1&pageSize=50`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );

        if (!postsResponse.ok) throw new Error("Error al obtener publicaciones.");
        const postsData = await postsResponse.json();

        // Filtrar publicaciones por el ID del usuario
        if (!postsData.items || postsData.items.length === 0) {
          console.log(" No se encontraron publicaciones.");
        }

        setPosts(postsData.items || []); // Si no hay publicaciones, devuelve un array vacío
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <p className="text-center mt-4">Cargando perfil...</p>;
  if (error) return <p className="alert alert-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow-lg p-4 user-profile-card">
          <div className="profile-header">
            <div className="profile-image">
              {userData?.profileImage ? (
                <img src={userData.profileImage} alt="Perfil" className="rounded-circle profile-pic" />
              ) : (
                <FaUserCircle size={120} className="text-muted" />
              )}
            </div>

            <div className="profile-info">
              <h2 className="text-success">{userData?.name}</h2>
              <p className="text-muted">@Usuario{userData?.id}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <h4>{posts.length}</h4>
              <p>Publicaciones</p>
            </div>
            <div>
              <h4>289</h4>
              <p>Seguidores</p>
            </div>
            <div>
              <h4>45</h4>
              <p>Siguiendo</p>
            </div>
          </div>

          <h4 className="mt-4">Publicaciones Recientes</h4>
          {posts.length > 0 ? (
            <ul className="list-group">
              {posts.map((post) => (
                <li key={post.id} className="list-group-item">
                  <strong>{post.name}</strong>
                  <p className="text-muted">Ubicación: {post.location}</p>
                  <p>{post.description || "Sin descripción"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Este usuario aún no tiene publicaciones.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
