import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerList.css';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customers from your API
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/customers');
        setCustomers(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Redirect to the vehicle details page when the customer card is clicked
  const handleSelectCustomer = (customerId) => {
    navigate(`/vehicles/${customerId}`);
  };

  return (
    <div className="index-container">
      <header className="header">CAT INSPECT</header>
      <div className="welcome-message">
        <h2>Welcome Instructor!</h2>
        <p>Vehicle management made easy</p>
      </div>
      <div className="customer-grid">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="customer-card"
            onClick={() => handleSelectCustomer(customer._id)}
          >
            <img src="/download.jpeg" alt="Customer Avatar" />
            <p>Name: {customer.name}</p> {/* Displaying customer name */}
            <p>Email: {customer.email}</p> {/* Displaying customer email */}
            <p
              className={customer.status === 'In Service' ? 'in-service' : 'not-acquiring'}
            >
              Status: {customer.status}
            </p>
          </div>
        ))}
      </div>
      <footer className="footer">
        &copy; 2024 Vehicle Inspection System. All rights reserved.
      </footer>
    </div>
  );
}

export default CustomerList;
