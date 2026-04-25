const mongoose = require('mongoose');

const workloadSchema = new mongoose.Schema({
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  courseName: { type: String, required: true },
  day: { 
    type: String, 
    enum: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    required: true 
  },
  timeSlot: { type: String, required: true },
  hoursPerWeek: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Workload', workloadSchema);