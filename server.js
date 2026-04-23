const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

const connectDB = require('./config/db');

// Import Routes
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// Make session user available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});

// Routes
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/courses', courseRoutes);

// Seed default courses with real CET data if empty
const Course = require('./models/Course');
const seedCourses = async () => {
  const count = await Course.countDocuments();
  if (count === 0) {
    await Course.insertMany([
      { name: 'B.Sc (Hons.) Computer Science & Data Analytics', code: 'BSC-CSDA', duration: '3 Years (Modular)', description: 'Industry demand-driven program with focus on programming, data analytics, AI/ML aligned with NEP 2020 credit framework. Entry/exit/re-entry at certificate, diploma, degree levels.', fees: 'As per CET IIT Patna norms', category: 'UG', icon: '💻' },
      { name: '4-Year BS in AI & Cyber Security', code: 'BS-AICS', duration: '4 Years (Modular)', description: 'Advanced program covering AI, Machine Learning, Cyber Security, Ethical Hacking, and Network Security with IIT Patna faculty guidance.', fees: 'As per CET IIT Patna norms', category: 'UG', icon: '🛡️' },
      { name: '4-Year BS in Computer Science & Data Analytics', code: 'BS-CSDA', duration: '4 Years (Modular)', description: 'Extended BS program providing deeper expertise in computer science, data engineering, big data analytics, and research methodology.', fees: 'As per CET IIT Patna norms', category: 'UG', icon: '📊' },
      { name: 'Bachelor in Business Administration', code: 'BBA', duration: '3 Years (Modular)', description: 'Professional business management program with marketing, finance, HR, and entrepreneurship modules guided by IIT Patna professors.', fees: 'As per CET IIT Patna norms', category: 'UG', icon: '💼' }
    ]);
    console.log('✅ Real CET courses seeded');
  }
};

// Seed default announcements with real CET data if empty
const Announcement = require('./models/Announcement');
const seedAnnouncements = async () => {
  const count = await Announcement.countDocuments();
  if (count === 0) {
    await Announcement.insertMany([
      { title: '🎓 Admission Open For Autumn 2026 Session — Apply at registrations.iitp-cep.in', content: 'Apply now for B.Sc CSDA, BS AICS, BS CSDA, and BBA programs.', type: 'Admission', priority: 3 },
      { title: '📅 Academic Calendar for Autumn 2026 — NEW', content: 'Download the updated academic calendar from academics section.', type: 'General', priority: 2 },
      { title: '📝 End Semester Examination Schedule (Spring 2026 Session) Released', content: 'Check the academic calendar for exam dates and timings.', type: 'Exam', priority: 2 },
      { title: '📢 Quiz-II Schedule (Autumn 2025 Session) Available', content: 'Check Moodle portal for quiz details.', type: 'Exam', priority: 1 },
      { title: '💼 Technology Club & Internship-Placement Cell Updates', content: 'Visit announcements section for internship and placement opportunities.', type: 'Placement', priority: 1 },
      { title: '📄 Bonafide Certificate Application Now Online', content: 'Apply for bonafide certificate through the CET portal.', type: 'General', priority: 1 }
    ]);
    console.log('✅ Real CET announcements seeded');
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  await seedCourses();
  await seedAnnouncements();
});
