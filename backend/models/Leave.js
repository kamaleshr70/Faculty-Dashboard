const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  date: { type: String, required: true },
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  courseName: { type: String, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);