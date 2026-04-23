const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  duration: { type: String, required: true },
  description: { type: String },
  fees: { type: String },
  category: { type: String, enum: ['UG', 'PG', 'Diploma', 'PhD'], default: 'UG' },
  icon: { type: String, default: '📚' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
