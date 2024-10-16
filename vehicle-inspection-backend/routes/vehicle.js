const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer'); // Assuming a Customer model exists

// Get all vehicles (without customerId filter)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ success: true, vehicles });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get vehicles by customerId
router.get('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customerId format
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customerId format' });
    }

    // Check if customer exists in the 'customers' collection
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Fetch vehicles associated with this customerId
    const vehicles = await Vehicle.find({ customerId }); // Use customerId directly if it's a string field

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ success: false, message: 'No vehicles found for this customer' });
    }

    res.json({ success: true, vehicles });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new vehicle (accept image URLs)
router.post(
  '/',
  [
    // Validate required fields
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('vehicleName').notEmpty().withMessage('Vehicle name is required'),
    body('vehicleImage').isArray().withMessage('Vehicle image should be an array of URLs'),
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customerId, vehicleName, vehicleImage } = req.body;

    try {
      // Validate customerId format
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({ success: false, message: 'Invalid customerId format' });
      }

      // Check if customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      // Create new vehicle object
      const vehicle = new Vehicle({
        customerId: customerId, // Assuming customerId is a string in the Vehicle model
        vehicleName,
        vehicleImage, // Save the URLs of the images
      });

      // Save the new vehicle
      const newVehicle = await vehicle.save();
      res.status(201).json({ success: true, vehicle: newVehicle });
    } catch (err) {
      console.error('Error saving vehicle:', err);
      res.status(500).json({ success: false, message: 'Error saving vehicle' });
    }
  }
);

module.exports = router;
