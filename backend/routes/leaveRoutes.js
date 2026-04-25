const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// APPLY for leave
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({ message: '✅ Leave applied successfully', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('facultyId', 'name department');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET leaves by faculty ID
router.get('/:facultyId', async (req, res) => {
  try {
    const leaves = await Leave.find({ facultyId: req.params.facultyId });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE leave status (approve/reject)
router.put('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: '✅ Leave status updated', leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;