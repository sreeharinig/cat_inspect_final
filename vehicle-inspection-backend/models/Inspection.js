const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  
  tires: {
    leftFront: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    rightFront: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    leftRear: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    rightRear: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
  },

  battery: {
    make: { type: String, enum: ['CAT', 'ABC', 'XYZ'], required: true },
    replacementDate: { type: Date, required: true },
    voltage: { type: String, enum: ['12V', '13V'], required: true },
    waterLevel: { type: String, enum: ['Good', 'Ok', 'Low'], required: true },
    damage: { type: Boolean, required: true },
    leak: { type: Boolean, required: true },
  },

  exterior: {
    rust: { type: Boolean, required: true },
    dent: { type: Boolean, required: true },
    damage: { type: Boolean, required: true },
    damageNotes: { type: String },
    suspensionOilLeak: { type: Boolean, required: true },
    images: [{ type: String }],  // URLs of images
  },

  brakes: {
    fluidLevel: { type: String, enum: ['good', 'ok', 'low'], required: true },
    frontCondition: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    rearCondition: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    emergencyBrakeCondition: { type: String, enum: ['good', 'ok', 'needs replacement'], required: true },
    overallSummary: { type: String, maxlength: 100 },
  },

  engine: {
    rust: { type: Boolean, required: true },
    dent: { type: Boolean, required: true },
    damage: { type: Boolean, required: true },
    oilCondition: { type: String, enum: ['good', 'bad'], required: true },
    oilColor: { type: String, enum: ['clean', 'brown', 'black'], required: true },
    brakeFluidCondition: { type: String, enum: ['good', 'bad'], required: true },
    brakeFluidColor: { type: String, enum: ['clean', 'brown', 'black'], required: true },
    oilLeak: { type: Boolean, required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inspection', inspectionSchema);
