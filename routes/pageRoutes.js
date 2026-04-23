const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Admission = require('../models/Admission');
const Contact = require('../models/Contact');
const Course = require('../models/Course');
const Announcement = require('../models/Announcement');

// Public Pages
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ priority: -1, createdAt: -1 }).limit(5);
    const studentCount = await Student.countDocuments();
    const courseCount = await Course.countDocuments();
    res.render('index', { page: 'home', announcements, studentCount, courseCount });
  } catch (error) {
    res.render('index', { page: 'home', announcements: [], studentCount: 0, courseCount: 0 });
  }
});

router.get('/about', (req, res) => {
  res.render('about', { page: 'about' });
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.render('courses', { page: 'courses', courses });
  } catch (error) {
    res.render('courses', { page: 'courses', courses: [] });
  }
});

router.get('/fees', (req, res) => {
  res.render('fees', { page: 'fees' });
});

router.get('/qa', (req, res) => {
  res.render('qa', { page: 'qa' });
});

router.get('/career', (req, res) => {
  res.render('career', { page: 'career' });
});

router.get('/admission', (req, res) => {
  res.render('admission', { page: 'admission' });
});

// Auth Pages
router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  res.render('login', { page: 'login' });
});

router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});

// Protected Admin Dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const admissions = await Admission.find().sort({ createdAt: -1 });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const totalStudents = students.length;
    const totalAdmissions = admissions.length;
    const pendingAdmissions = admissions.filter(a => a.status === 'Pending').length;
    const totalMessages = contacts.length;
    res.render('dashboard', {
      page: 'dashboard',
      user: req.user,
      students,
      admissions,
      contacts,
      stats: { totalStudents, totalAdmissions, pendingAdmissions, totalMessages }
    });
  } catch (error) {
    res.render('dashboard', {
      page: 'dashboard',
      user: req.user,
      students: [],
      admissions: [],
      contacts: [],
      stats: { totalStudents: 0, totalAdmissions: 0, pendingAdmissions: 0, totalMessages: 0 }
    });
  }
});

module.exports = router;
