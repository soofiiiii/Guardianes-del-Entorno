import React from 'react';

const AreaInfo = ({ area }) => {
    //   Si `area` es `null`, muestra un mensaje de carga en lugar de romper la app
    if (!area) {
        return <p style={{ textAlign: "center", color: "red" }}>Cargando información del área...</p>;
    }

    return (
        <div className="area-info">
            <h1>{area.name}</h1>
            <img src={area.imageUrl || "https://via.placeholder.com/600x400"} alt={area.name} className="area-image" />
            <p><strong>Ubicación:</strong> {area.location}</p>
            <p><strong>Tipo:</strong> {area.areaType}</p>
            <p><strong>Región:</strong> {area.region}</p> 
            <p><strong>Estado de Conservación:</strong> {area.conservationStatus}</p>
            <p><strong>Descripción:</strong> {area.description}</p>
        </div>
    );
};

export default AreaInfo;
