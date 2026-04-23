const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ category: 1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/courses
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
