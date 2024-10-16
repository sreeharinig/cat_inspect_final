import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VehicleDetails.css'; // Ensure the CSS file exists

function VehicleDetails() {
  const { customerId } = useParams(); // Retrieve customerId from route params
  const navigate = useNavigate(); // Use navigate for redirection
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // Fetch vehicles by customerId from backend
        const response = await axios.get(`http://localhost:5001/api/vehicles/customers/${customerId}`);
        setVehicles(response.data.vehicles);
      } catch (error) {
        setError('Error fetching vehicle details');
        console.error('Error fetching vehicle details:', error);
      }
    };

    if (customerId) {
      fetchVehicleDetails(); // Call fetch only if customerId exists
    }
  }, [customerId]);

  const handleServiceClick = (vehicleId) => {
    navigate(`/inspection/${vehicleId}`); // Redirect to the inspection page
  };

  return (
    <div className="vehicle-details-page">
      <header className="header">
        <h1>CAT INSPECT</h1>
      </header>
      <main className="main-content">
        {/* Removed the vehicle details container */}
        <div className="vehicle-images">
          {error && <p>{error}</p>}
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="vehicle-card">
                <h3>{vehicle.vehicleName}</h3>
                {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 && (
                  <div className="vehicle-image-container">
                    {vehicle.vehicleImage.map((image, idx) => (
                      <div key={idx} className="vehicle-image-container">
                        <img
                          src={image}
                          alt={`Vehicle ${idx + 1}`}
                          className="vehicle-image"
                        />
                        <button className="service-button" onClick={() => handleServiceClick(vehicle._id)}>
                          Service Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No vehicles found for this customer.</p>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Vehicle Inspection System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default VehicleDetails; // Ensure the export name matches the component
