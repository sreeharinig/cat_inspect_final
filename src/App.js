import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CustomerList from './components/CustomerList';
import VehicleDetails from './components/VehicleDetails';
import InspectionPage from './components/InspectionPage'; // Import thez InspectionPage component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/vehicles/:customerId" element={<VehicleDetails />} />
          <Route path="/inspection/:vehicleId" element={<InspectionPage />} /> {/* Add inspection route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
