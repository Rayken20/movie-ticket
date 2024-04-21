import React, { useEffect, useState } from "react";

export default function TheatreDetails({ theatreId }) {
    const [theatre, setTheatre] = useState(null);

    useEffect(() => {
        const fetchTheatre = async () => {
            try {
                const response = await fetch(`/theaters/${theatreId}`);
                const data = await response.json();
                setTheatre(data);
            } catch (error) {
                console.error("Error fetching theatre details: ", error);
            }
        };

        if (theatreId !== null){
            fetchTheatre();

        }
        
    }, [theatreId]);

    if (theatreId === null) {
        return null;
    }

    if (!theatre) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{theatre.name}</h1>
            <p>Location: {theatre.location}</p>
            <p>Capacity: {theatre.capacity}</p>
            
        </div>
    );
}