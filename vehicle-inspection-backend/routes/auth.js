// vehicle-inspection-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const Inspector = require('../models/Inspector');

// Login route for Inspector
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find the inspector by email and password
        const inspector = await Inspector.findOne({ email, password });
        
        if (inspector) {
            // Successful login
            res.status(200).json({ message: 'Login successful', inspector });
        } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        // Server error
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
