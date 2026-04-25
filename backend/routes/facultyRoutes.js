const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER faculty
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, subject } = req.body;
    const existing = await Faculty.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, email, password: hashed, department, subject });
    await faculty.save();
    res.status(201).json({ message: '✅ Faculty registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN faculty
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: faculty._id, name: faculty.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, faculty: { 
      id: faculty._id, 
      name: faculty.name, 
      email: faculty.email,
      department: faculty.department,
      subject: faculty.subject
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all faculty
router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.find().select('-password');
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;