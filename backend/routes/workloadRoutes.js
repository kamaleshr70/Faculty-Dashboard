const express = require('express');
const router = express.Router();
const Workload = require('../models/Workload');

// ADD workload
router.post('/', async (req, res) => {
  try {
    const workload = new Workload(req.body);
    await workload.save();
    res.status(201).json({ message: '✅ Workload added', workload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all workloads
router.get('/', async (req, res) => {
  try {
    const workloads = await Workload.find().populate('facultyId', 'name department');
    res.json(workloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET workload by faculty ID
router.get('/:facultyId', async (req, res) => {
  try {
    const workloads = await Workload.find({ facultyId: req.params.facultyId });
    res.json(workloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE workload
router.delete('/:id', async (req, res) => {
  try {
    await Workload.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Workload deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
