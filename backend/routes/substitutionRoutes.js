const express = require('express');
const router = express.Router();
const Substitution = require('../models/Substitution');
const Workload = require('../models/Workload');
const Faculty = require('../models/Faculty');

// SMART SUGGEST substitute
// Finds faculty who are FREE at that slot + has lowest workload
router.post('/suggest', async (req, res) => {
  try {
    const { day, timeSlot, absentFacultyId } = req.body;

    // Step 1: Find all faculty busy at that slot
    const busyWorkloads = await Workload.find({ day, timeSlot });
    const busyFacultyIds = busyWorkloads.map(w => w.facultyId.toString());

    // Also exclude the absent faculty themselves
    busyFacultyIds.push(absentFacultyId);

    // Step 2: Get all faculty NOT in busy list
    const freeFaculty = await Faculty.find({
      _id: { $nin: busyFacultyIds }
    }).select('-password');

    if (freeFaculty.length === 0) {
      return res.status(404).json({ message: '❌ No free faculty available at this slot' });
    }

    // Step 3: For each free faculty, count their total workload hours
    const facultyWithWorkload = await Promise.all(
      freeFaculty.map(async (f) => {
        const workloads = await Workload.find({ facultyId: f._id });
        const totalHours = workloads.reduce((sum, w) => sum + w.hoursPerWeek, 0);
        return { faculty: f, totalHours };
      })
    );

    // Step 4: Sort by lowest workload → best substitute is first
    facultyWithWorkload.sort((a, b) => a.totalHours - b.totalHours);

    res.json({
      message: '✅ Suggested substitutes (sorted by lowest workload)',
      suggestions: facultyWithWorkload
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ASSIGN substitute
router.post('/assign', async (req, res) => {
  try {
    const substitution = new Substitution(req.body);
    await substitution.save();
    res.status(201).json({ message: '✅ Substitute assigned successfully', substitution });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all substitutions
router.get('/', async (req, res) => {
  try {
    const subs = await Substitution.find()
      .populate('absentFacultyId', 'name')
      .populate('substituteFacultyId', 'name')
      .populate('leaveId');
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;