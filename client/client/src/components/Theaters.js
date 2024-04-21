import React, { useState, useEffect } from "react";

export default function Theaters({ setSelectedTheaterId }) {
    const [theaters, setTheaters] = useState([]);

    const fetchTheaters = async () => {
        const url = '/theaters';

        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "application/json"
                },
            });
            const data = await response.json();
            setTheaters(data);
        } catch (error) {
            console.error("Error fetching theaters: ", error);
        }
    }

    useEffect(() => {
        fetchTheaters();
    }, []);

    const handleTheaterClick = (theaterId) => {
        setSelectedTheaterId(theaterId);
    };

    return (
        <div className="container">
            <div className="row">
                {theaters.map((theatre) => (
                    <div className="col-md-4 mb-4" key={theatre.id}>
                        <a href={`/theatres/${theatre.id}`} className="card theater-card">
                            <div className="card-body">
                                <h5 className="card-title">{theatre.name}</h5>
                                <p className="card-text">Location: {theatre.location}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}