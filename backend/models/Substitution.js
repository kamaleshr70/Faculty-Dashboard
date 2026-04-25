const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
  leaveId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Leave', 
    required: true 
  },
  absentFacultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  substituteFacultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  courseName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Substitution', substitutionSchema);