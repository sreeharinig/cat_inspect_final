// src/routes/auth.js
const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/login', (req, res) => {
  res.send('Login route');
});

module.exports = router;
