const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  semester: { type: Number, default: 1, min: 1, max: 8 },
  fatherName: { type: String, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  address: { type: String },
  admissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated', 'Suspended'], default: 'Active' },
  profileImage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
