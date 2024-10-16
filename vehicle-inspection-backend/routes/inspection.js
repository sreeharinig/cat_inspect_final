const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose'); 
const router = express.Router();
const Inspection = require('../models/Inspection');

router.get('/vehicle/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;

    // Convert vehicleId from string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({ error: 'Invalid vehicle ID format' });
    }

    try {
        const inspections = await Inspection.find({ vehicleId: mongoose.Types.ObjectId(vehicleId) });
        
        if (inspections.length === 0) {
            return res.status(404).json({ message: 'No inspection data found for this vehicle' });
        }
        
        res.json({ inspections });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inspection data' });
    }
});

// Create a new inspection
router.post(
    '/create',
    [
        body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
        body('tires').notEmpty().withMessage('Tires information is required'),
        body('battery').notEmpty().withMessage('Battery information is required'),
        body('exterior').notEmpty().withMessage('Exterior information is required'),
        body('brakes').notEmpty().withMessage('Brakes information is required'),
        body('engine').notEmpty().withMessage('Engine information is required'),
        body('exterior.images').isArray().withMessage('Images must be an array of URLs'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { vehicleId, tires, battery, exterior, brakes, engine } = req.body;

        try {
            const newInspection = new Inspection({
                vehicleId,
                tires,
                battery,
                exterior,
                brakes,
                engine,
            });

            await newInspection.save();
            res.status(201).json({ success: true, inspection: newInspection });
        } catch (error) {
            console.error('Error saving inspection:', error);
            res.status(500).json({ success: false, message: 'Error saving inspection', error });
        }
    }
);

// Update an inspection by ID
router.put('/update/:inspectionId', async (req, res) => {
    try {
        const updatedInspection = await Inspection.findByIdAndUpdate(req.params.inspectionId, req.body, { new: true });
        if (!updatedInspection) {
            return res.status(404).json({ success: false, message: 'Inspection not found' });
        }
        res.json({ success: true, inspection: updatedInspection });
    } catch (error) {
        console.error('Error updating inspection:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Upload image to the inspection
router.post('/upload-image/:inspectionId', async (req, res) => {
    try {
        const inspection = await Inspection.findById(req.params.inspectionId);
        if (!inspection) {
            return res.status(404).json({ success: false, message: 'Inspection not found' });
        }

        // Assume req.body contains the image URL to add
        const { imageUrl } = req.body;
        inspection.exterior.images.push(imageUrl); // Add the image URL to the existing array

        await inspection.save();
        res.json({ success: true, inspection });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
