const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['General', 'Admission', 'Exam', 'Event', 'Placement'], default: 'General' },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
