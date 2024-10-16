const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET route to fetch all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST route to create a new customer
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const customer = new Customer({
    name,
    email,
    phone,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({ success: false, message: 'Error creating customer' });
  }
});

module.exports = router;
