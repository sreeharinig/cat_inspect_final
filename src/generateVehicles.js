// seedVehicles.js
const mongoose = require('mongoose');
const Vehicle = require('./src/models/Vehicle');  // Adjust the path as necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Array of vehicles to insert
const vehicles = [
  {
    customerId: '64d4e3b8b3f1a0b1d37e8d91',  // Replace with valid customer IDs
    vehicleName: 'Toyota Camry',
    images: ['http://example.com/image1.jpg'],
    brakeQuality: 'Good',
    oilQuality: 'Good',
    tyreQuality: 'Good'
  },
  {
    customerId: '64d4e3b8b3f1a0b1d37e8d92',
    vehicleName: 'Honda Civic',
    images: ['http://example.com/image2.jpg'],
    brakeQuality: 'Bad',
    oilQuality: 'Good',
    tyreQuality: 'Worst'
  },
  // Add more vehicles here
];

// Insert vehicles into the database
Vehicle.insertMany(vehicles)
  .then(() => {
    console.log('Vehicles added successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error adding vehicles', err);
    mongoose.connection.close();
  });
