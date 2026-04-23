const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// POST /api/admissions - Submit admission form
router.post('/', async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({ success: true, data: admission, message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admissions - List all submissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json({ success: true, data: admissions, count: admissions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admissions/:id - Update admission status
router.put('/:id', async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admission) return res.status(404).json({ success: false, message: 'Admission not found' });
    res.json({ success: true, data: admission, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admissions/:id - Delete admission
router.delete('/:id', async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
