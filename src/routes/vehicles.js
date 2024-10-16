// src/routes/vehicles.js
const express = require('express');
const router = express.Router();

// Mock database for demonstration
const vehicles = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2020 },
  { id: '2', make: 'Honda', model: 'Civic', year: 2019 },
];

// Get all vehicles
router.get('/', (req, res) => {
  res.json(vehicles);
});

// Get vehicle by ID
router.get('/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404).send('Vehicle not found');
  }
});

// Add a new vehicle
router.post('/', (req, res) => {
  const newVehicle = {
    id: (vehicles.length + 1).toString(),
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
  };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

// Update a vehicle
router.put('/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (vehicle) {
    vehicle.make = req.body.make || vehicle.make;
    vehicle.model = req.body.model || vehicle.model;
    vehicle.year = req.body.year || vehicle.year;
    res.json(vehicle);
  } else {
    res.status(404).send('Vehicle not found');
  }
});

// Delete a vehicle
router.delete('/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === req.params.id);
  if (index !== -1) {
    vehicles.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Vehicle not found');
  }
});

module.exports = router;
