const express = require('express');
const router = express.Router();
const Inspector = require('../models/Inspector'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// POST route for inspector registration with validation
router.post('/register', [
    // Validate email, password, and name
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    body('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, name } = req.body;
    try {
        // Check if inspector already exists
        const existingInspector = await Inspector.findOne({ email });
        if (existingInspector) {
            return res.status(400).json({ success: false, message: 'Inspector already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new inspector
        const newInspector = new Inspector({ email, password: hashedPassword, name });
        await newInspector.save();

        // Generate JWT token
        const token = jwt.sign({ id: newInspector._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, name: newInspector.name });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET route to fetch all inspectors
router.get('/', async (req, res) => {
    try {
        // Fetch all inspectors from the database
        const inspectors = await Inspector.find();
        res.json({ success: true, inspectors });
    } catch (error) {
        console.error('Error fetching inspectors:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST route for inspector login with validation
router.post('/login', [
    // Validate email and password
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Find inspector by email
        const inspector = await Inspector.findOne({ email });
        if (!inspector) {
            return res.status(400).json({ success: false, message: 'Inspector not found' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, inspector.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: inspector._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, name: inspector.name });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
