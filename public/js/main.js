// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    if (!target) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { counter.textContent = target + (target > 100 ? '+' : ''); clearInterval(timer); }
      else { counter.textContent = Math.floor(current) + (target > 100 ? '+' : ''); }
    }, 16);
  });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== FORM SUBMISSIONS =====
async function submitAdmission(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/admissions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) { showToast('Enquiry submitted successfully! We will contact you soon 🎉'); form.reset(); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Something went wrong!', 'error'); }
}

async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) { showToast('Message sent successfully! ✉️'); form.reset(); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Something went wrong!', 'error'); }
}

// ===== AUTH =====
async function handleLogin(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) { window.location.href = '/dashboard'; }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Login failed!', 'error'); }
}

async function handleRegister(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) { window.location.href = '/dashboard'; }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Registration failed!', 'error'); }
}

// ===== DASHBOARD FUNCTIONS =====
function showTab(tab) {
  document.querySelectorAll('[id^="tab-"]').forEach(el => el.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

async function addStudent(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch('/api/students', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) { showToast('Student added! ✅'); setTimeout(() => location.reload(), 1000); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Failed to add student', 'error'); }
}

function editStudent(id, name, email, phone, rollNo, course, semester, status) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-email').value = email;
  document.getElementById('edit-phone').value = phone;
  document.getElementById('edit-rollNo').value = rollNo;
  document.getElementById('edit-course').value = course;
  document.getElementById('edit-semester').value = semester;
  document.getElementById('edit-status').value = status;
  document.getElementById('editStudentModal').classList.add('show');
}

async function updateStudent(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  const id = formData.id;
  delete formData.id;
  try {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (result.success) { showToast('Student updated! ✅'); setTimeout(() => location.reload(), 1000); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Failed to update', 'error'); }
}

async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) { showToast('Student deleted'); setTimeout(() => location.reload(), 1000); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Failed to delete', 'error'); }
}

async function updateAdmission(id, status) {
  try {
    const res = await fetch(`/api/admissions/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    });
    const result = await res.json();
    if (result.success) { showToast(`Application ${status}!`); setTimeout(() => location.reload(), 1000); }
    else { showToast(result.message, 'error'); }
  } catch (err) { showToast('Failed to update', 'error'); }
}

// ===== CHATBOT with real CET data =====
function toggleChatbot() {
  document.getElementById('chatbot').classList.toggle('open');
}

const chatResponses = {
  'admission': '🎓 Admissions are open for Autumn 2026 session! Eligibility: 10+2 with Min 60%. You need JEE/CUET/BITSAT score OR take IITP-SAT entrance test. Apply at registrations.iitp-cep.in',
  'eligibility': '📋 For CSDA/AICS: 10+2 Science with Min 60% + JEE/NEET/CUET/BITSAT/SAT score or IITP-SAT. For BBA: 10+2 any stream with Min 60% + same entrance options.',
  'fee': '💰 For detailed fee structure and academic service charges, visit the official CET page or check /fees on our website.',
  'course': '📚 CET offers: B.Sc (Hons.) CSDA (3yr), 4-Year BS AI & Cyber Security, 4-Year BS CSDA, and BBA (3yr). All are NEP 2020 modular programs.',
  'csda': '💻 B.Sc (Hons.) Computer Science & Data Analytics — 3 year modular program with AI/ML specialization. Entry/exit/re-entry at certificate, diploma, degree levels.',
  'aics': '🛡️ 4-Year BS in AI & Cyber Security — Covers AI, ML, Cyber Security, Ethical Hacking. Download brochure: cet.iitp.ac.in/images/pdf/AICS.pdf',
  'bba': '💼 Bachelor in Business Administration — 3 year modular program with Marketing, Finance, HR, Entrepreneurship. 10+2 any stream with 60% required.',
  'moodle': '📖 Moodle is the online learning portal for CET students. Access at: cet.iitp.ac.in → Moodle link. Used for classes, assignments, and resources.',
  'timetable': '🕐 Check your class timetable at: cet.iitp.ac.in → Academics → Time Table',
  'time table': '🕐 Check your class timetable at: cet.iitp.ac.in → Academics → Time Table',
  'calendar': '📅 Academic Calendar for Autumn 2026 is available at cet.iitp.ac.in → Academics → Academic Calendar',
  'exam': '📝 End Semester Examination Schedule (Spring 2026) is available at cet.iitp.ac.in → Academics. Evaluation: 20% Quiz + 30% Assignment + 50% End Sem.',
  'evaluation': '📝 Evaluation: 20% Class Test & Quiz + 30% Regular Assignments + 50% End Semester Exam (Proctored). ≥75% = Degree with Distinction!',
  'holiday': '🏖️ Holiday list available at cet.iitp.ac.in → Academics → Holiday List. Institute follows IIT Patna holiday calendar.',
  'faculty': '👨‍🏫 CET has IIT Patna professors + guest faculty from KPMG, EY, Toronto Metropolitan University, Wayne State University, Kings College London, Nalanda University.',
  'hostel': '🏠 Hostel provides bed, study table, WiFi, 24/7 security. Mess provides hygienic nutritious meals.',
  'placement': '💼 CET has a Technology Club & Internship-Placement Cell. Check: cet.iitp.ac.in → Announcements → Placement Cell.',
  'bonafide': '📄 Apply for bonafide certificate at: cet.iitp.ac.in → Bonafide Application',
  'gymkhana': '🏅 E-Gymkhana handles student activities, clubs & sports. Visit: cet.iitp.ac.in → E-Gymkhana',
  'nep': '📘 All programs follow NEP 2020 with modular structure: Year 1 = Certificate, Year 2 = Diploma, Year 3 = Degree, Year 4 = BS Research.',
  'iit': '🏛️ CET is part of IIT Patna, located at Bihta-801106, Bihar. Programs are designed by IIT Patna Senate faculty.',
  'contact': '📞 CET Office: Academic Section, Admin Block, 3rd Floor, Room 301, IIT Patna, Bihta-801106, Bihar, India.',
  'hello': 'Namaste! 👋 I am your CET IIT Patna assistant. Ask me about admissions, programs, eligibility, Moodle, timetable, or campus life!',
  'hi': 'Hi! 😊 Welcome to CET IIT Patna. I can help with admissions, courses (CSDA/AICS/BBA), fees, faculty, Moodle, or placements!',
  'jee': '🎯 JEE (Main/Advanced) score holders are eligible for CSDA and AICS programs. You can also use CUET, BITSAT, SAT, or IITP-SAT.',
  'cuet': '🎯 CUET score is accepted for admission to all CET programs — CSDA, AICS, and BBA.',
  'sat': '🌍 International students with SAT-I/SAT-II (US) or BMAT (UK) scores are eligible for CET programs.',
  'register': '📝 Official registration portal: registrations.iitp-cep.in — Apply for Autumn 2026 admission.',
  'apply': '📝 Apply at the official registration portal: registrations.iitp-cep.in. For queries, fill our admission enquiry form at /admission.'
};

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';

  let reply = "I'm not sure about that. Try asking about: admissions, eligibility, CSDA, AICS, BBA, Moodle, timetable, exams, fees, faculty, placements, NEP, or holidays! 😊";
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(chatResponses)) {
    if (lower.includes(key)) { reply = val; break; }
  }

  setTimeout(() => {
    messages.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.background = window.scrollY > 50 ? 'rgba(13,27,74,0.98)' : 'rgba(13,27,74,0.95)';
});
