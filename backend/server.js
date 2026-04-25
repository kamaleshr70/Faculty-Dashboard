const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '✅ Faculty Dashboard Backend is Running!' });
});

// Routes
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/workload', require('./routes/workloadRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/substitution', require('./routes/substitutionRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});