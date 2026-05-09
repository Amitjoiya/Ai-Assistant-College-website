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
function showTab(tab, btn) {
  document.querySelectorAll('.tab-content, [id^="tab-"]').forEach(el => el.style.display = 'none');
  const target = document.getElementById('tab-' + tab);
  if (target) target.style.display = 'block';
  document.querySelectorAll('.dash-tab, .sidebar-link').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Close sidebar on mobile
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
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

// ===== SMART CHATBOT with CET data =====
function toggleChatbot() {
  document.getElementById('chatbot').classList.toggle('open');
}

// Knowledge base with multi-keyword matching and categories
const chatKB = [
  {
    keywords: ['hello','hi','hey','hii','hiii','namaste','namaskar','hlo','hlw','good morning','good evening','good afternoon','kaise ho','kya hal'],
    reply: 'Namaste! 🙏 Welcome to CET IIT Patna. I\'m your smart assistant!\n\nI can help you with:\n• 📋 Admissions & Eligibility\n• 📚 Programs (CSDA/AICS/BBA)\n• 💰 Fee Structure\n• 👨‍🏫 Faculty & Academics\n• 🏠 Hostel & Campus Life\n• 💼 Placements\n\nJust ask your question!'
  },
  {
    keywords: ['admission','admit','dakhila','apply','registration','register','enroll','enrollment','join','form','kab','open','autumn','session','how to apply','kaise apply'],
    reply: '🎓 <b>Admissions Open — Autumn 2026!</b>\n\n<b>Eligibility:</b> 10+2 with Min 60%\n<b>Accepted Scores:</b> JEE / CUET / BITSAT / SAT / IITP-SAT\n<b>Programs:</b> B.Sc CSDA, BS AICS, BS CSDA, BBA\n\n📝 <b>Apply Now:</b> <a href="https://registrations.iitp-cep.in" target="_blank">registrations.iitp-cep.in</a>\n\nOr fill our enquiry form at <a href="/admission">/admission</a> page!'
  },
  {
    keywords: ['eligibility','eligible','qualification','yogyata','criteria','requirement','marks','percentage','12th','10+2','qualify','minimum'],
    reply: '📋 <b>Eligibility Criteria:</b>\n\n<b>For CSDA & AICS:</b>\n• 10+2 Science stream with Min 60%\n• JEE/NEET/CUET/BITSAT/SAT or IITP-SAT score\n\n<b>For BBA:</b>\n• 10+2 any stream with Min 60%\n• Same entrance test options\n\n<b>Reservation:</b> As per Govt. of India norms\n<b>Age:</b> No upper age limit'
  },
  {
    keywords: ['fee','fees','paisa','cost','price','kitna','charges','payment','scholarship','tuition','kharcha','money'],
    reply: '💰 <b>Fee Structure:</b>\n\nFees vary by program and are set as per CET IIT Patna norms.\n\n📄 Check detailed fee breakdown on our <a href="/fees">Fee Structure page</a>\n\nIncludes:\n• Tuition Fee\n• Hostel & Mess Charges\n• Academic Service Charges\n• Examination Fee\n\n💡 Scholarships available for merit students!'
  },
  {
    keywords: ['course','program','courses','programs','kya padhai','subject','branch','stream','degree','what courses','konsa'],
    reply: '📚 <b>CET Programs (NEP 2020):</b>\n\n💻 <b>B.Sc (Hons.) CSDA</b> — 3 Years\nComputer Science & Data Analytics with AI/ML\n\n🛡️ <b>BS AI & Cyber Security</b> — 4 Years\nAI, ML, Ethical Hacking, Network Security\n\n📊 <b>BS CSDA</b> — 4 Years\nAdvanced CS, Big Data, Research\n\n💼 <b>BBA</b> — 3 Years\nMarketing, Finance, HR, Entrepreneurship\n\nAll programs have entry/exit/re-entry options!'
  },
  {
    keywords: ['csda','computer science','data analytics','bsc','b.sc','cs'],
    reply: '💻 <b>B.Sc (Hons.) Computer Science & Data Analytics</b>\n\n⏱️ Duration: 3 Years (Modular)\n📋 Entry: 10+2 Science, 60%+\n\n<b>Key Subjects:</b> Programming, Data Structures, AI/ML, Data Analytics, Databases, Cloud Computing\n\n<b>NEP Structure:</b>\n• Year 1 → Certificate\n• Year 2 → Diploma\n• Year 3 → Degree\n\nDesigned by IIT Patna faculty!'
  },
  {
    keywords: ['aics','cyber','security','hacking','ethical','ai course','artificial intelligence'],
    reply: '🛡️ <b>BS in AI & Cyber Security</b>\n\n⏱️ Duration: 4 Years (Modular)\n📋 Entry: 10+2 Science, 60%+\n\n<b>Key Subjects:</b> AI, Machine Learning, Cyber Security, Ethical Hacking, Network Security, Cryptography\n\n📥 Brochure: cet.iitp.ac.in/images/pdf/AICS.pdf\n\nOne of the most in-demand programs!'
  },
  {
    keywords: ['bba','business','management','mba','commerce','marketing'],
    reply: '💼 <b>Bachelor in Business Administration</b>\n\n⏱️ Duration: 3 Years (Modular)\n📋 Entry: 10+2 Any Stream, 60%+\n\n<b>Key Subjects:</b> Marketing, Finance, HR, Operations, Entrepreneurship, Business Analytics\n\nGuided by IIT Patna professors & industry experts from KPMG, EY!'
  },
  {
    keywords: ['faculty','professor','teacher','sir','mam','madam','prof','instructor','who teaches','kon padhata'],
    reply: '👨‍🏫 <b>Our Distinguished Faculty:</b>\n\n🏛️ <b>IIT Patna Professors</b> — Core academic faculty\n\n🌍 <b>Guest Faculty from:</b>\n• KPMG & EY (Industry)\n• Toronto Metropolitan University\n• Wayne State University\n• Kings College London\n• Nalanda University\n\nWorld-class education right here in Bihar!'
  },
  {
    keywords: ['hostel','accommodation','mess','food','room','stay','reside','living','rehna','khana','canteen'],
    reply: '🏠 <b>Hostel & Campus Life:</b>\n\n🛏️ Furnished rooms with bed & study table\n📶 High-speed WiFi throughout\n🔒 24/7 Security & CCTV\n🍽️ Hygienic nutritious meals in mess\n🏥 Medical facility on campus\n🏃 Sports & recreation facilities\n\nIIT Patna campus — Bihta, Bihar'
  },
  {
    keywords: ['placement','job','salary','package','internship','career','naukri','recruit','company','hiring','placed'],
    reply: '💼 <b>Placements & Career:</b>\n\n🏢 <b>Technology Club & Placement Cell</b> actively connects students with industry\n\n<b>Opportunities:</b>\n• Summer & Winter Internships\n• Campus Placement Drives\n• Industry Projects\n• Hackathons & Competitions\n\n📌 Check: cet.iitp.ac.in → Placement Cell\n\nAlso visit our <a href="/career">Career page</a>!'
  },
  {
    keywords: ['exam','examination','test','pariksha','quiz','marks','result','grade','score','passing'],
    reply: '📝 <b>Examination & Evaluation:</b>\n\n📊 <b>Marking Scheme:</b>\n• 20% — Class Test & Quiz\n• 30% — Regular Assignments\n• 50% — End Semester Exam (Proctored)\n\n🏆 ≥75% marks = <b>Degree with Distinction!</b>\n\n📅 Exam schedule: cet.iitp.ac.in → Academics'
  },
  {
    keywords: ['moodle','portal','online','class','lms','learning','assignment','login portal','study material'],
    reply: '📖 <b>Moodle Learning Portal:</b>\n\nMoodle is the official LMS for CET students.\n\n<b>Used for:</b>\n• Online Classes & Lectures\n• Assignment Submissions\n• Study Materials & Notes\n• Quiz & Assessments\n\n🔗 Access: cet.iitp.ac.in → Moodle Portal'
  },
  {
    keywords: ['timetable','time table','schedule','class timing','kab class','routine','slot'],
    reply: '🕐 <b>Class Timetable:</b>\n\nUpdated timetable for current session is available at:\n🔗 cet.iitp.ac.in → Academics → Time Table\n\nClasses are held Mon-Sat with regular breaks.'
  },
  {
    keywords: ['calendar','academic calendar','session','semester','when start','kab shuru'],
    reply: '📅 <b>Academic Calendar — Autumn 2026:</b>\n\nDownload the updated calendar at:\n🔗 cet.iitp.ac.in → Academics → Academic Calendar\n\nIncludes semester dates, exam schedules, holidays & events.'
  },
  {
    keywords: ['holiday','chutti','vacation','break','leave','off day'],
    reply: '🏖️ <b>Holiday List:</b>\n\nCET follows the IIT Patna holiday calendar.\n\n🔗 Check: cet.iitp.ac.in → Academics → Holiday List\n\nIncludes national holidays, festivals & semester breaks.'
  },
  {
    keywords: ['nep','national education','2020','modular','credit','exit','entry'],
    reply: '📘 <b>NEP 2020 Framework:</b>\n\nAll CET programs follow NEP 2020 modular structure:\n\n📜 Year 1 → <b>Certificate</b>\n📜 Year 2 → <b>Diploma</b>\n🎓 Year 3 → <b>Degree</b>\n🔬 Year 4 → <b>BS (Research)</b>\n\nStudents can exit & re-enter at any level with earned credits!'
  },
  {
    keywords: ['jee','jee main','jee advanced','entrance','exam score'],
    reply: '🎯 <b>JEE Score Holders:</b>\n\nJEE Main/Advanced score is accepted for:\n• B.Sc CSDA\n• BS AICS\n• BS CSDA\n\nOther accepted scores: CUET, BITSAT, SAT, NEET, IITP-SAT'
  },
  {
    keywords: ['cuet','common university','central university'],
    reply: '🎯 <b>CUET Score:</b>\n\nCUET score is accepted for ALL CET programs:\n• B.Sc CSDA ✅\n• BS AICS ✅\n• BS CSDA ✅\n• BBA ✅'
  },
  {
    keywords: ['contact','phone','email','address','location','kahan','where','office','pata'],
    reply: '📞 <b>Contact CET IIT Patna:</b>\n\n📍 Academic Section, Admin Block\n3rd Floor, Room No. 301\nIIT Patna, Bihta-801106\nBihar, India\n\n🌐 Website: cet.iitp.ac.in\n📝 Enquiry: Use our <a href="/admission">Admission page</a>'
  },
  {
    keywords: ['bonafide','certificate','document','letter'],
    reply: '📄 <b>Bonafide Certificate:</b>\n\nApply online at: cet.iitp.ac.in → Bonafide Application\n\nProcessed by the Academic Section.'
  },
  {
    keywords: ['gymkhana','club','sports','activity','event','fest','cultural'],
    reply: '🏅 <b>E-Gymkhana & Student Life:</b>\n\n• Student Clubs & Societies\n• Sports Tournaments\n• Cultural Events & Fests\n• Technical Competitions\n\n🔗 Visit: cet.iitp.ac.in → E-Gymkhana'
  },
  {
    keywords: ['iit','patna','college','about','institute','campus','bihta'],
    reply: '🏛️ <b>About CET IIT Patna:</b>\n\nCentre for Educational Technology (CET) is part of IIT Patna.\n\n📍 Located at Bihta-801106, Bihar\n🎓 Programs designed by IIT Patna Senate\n👨‍🏫 Faculty from IIT + global universities\n📘 NEP 2020 aligned curriculum\n\nLearn more on our <a href="/about">About page</a>!'
  },
  {
    keywords: ['thank','thanks','dhanyawad','shukriya','okay','ok','got it','samajh','understood'],
    reply: 'You\'re welcome! 😊 Feel free to ask anything else about CET IIT Patna. I\'m always here to help! 🙏'
  },
  {
    keywords: ['bye','goodbye','alvida','see you','chal','chalo'],
    reply: 'Goodbye! 👋 Best of luck with your journey at CET IIT Patna. Visit again anytime! 🎓'
  },
  {
    keywords: ['help','madad','sahayata','kya kar sakte','what can you'],
    reply: '🤖 <b>I can help with:</b>\n\n📋 Admissions & Eligibility\n📚 Programs (CSDA, AICS, BBA)\n💰 Fee Structure\n📝 Exams & Evaluation\n👨‍🏫 Faculty Information\n🏠 Hostel & Campus Life\n💼 Placements & Career\n📅 Timetable & Calendar\n📖 Moodle Portal\n📘 NEP 2020\n\nJust type your question!'
  }
];

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';

  // Smart matching: score each KB entry by keyword matches
  const lower = msg.toLowerCase().replace(/[?!.,]/g, '');
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of chatKB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.length; // longer keyword matches = more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  let reply;
  if (bestMatch && bestScore > 0) {
    reply = bestMatch.reply;
  } else {
    reply = '🤔 I didn\'t quite get that. Try asking about:\n\n• <b>Admissions</b> — "How to apply?"\n• <b>Courses</b> — "What programs are available?"\n• <b>Fees</b> — "What is the fee structure?"\n• <b>Placements</b> — "Tell me about placements"\n• <b>Hostel</b> — "Hostel facilities?"\n• <b>Faculty</b> — "Who are the teachers?"\n\nOr type <b>"help"</b> to see everything I can do! 😊';
  }

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Typing...';
  typingDiv.style.opacity = '0.6';
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();
    messages.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 600 + Math.random() * 400);
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.background = window.scrollY > 50 ? 'rgba(13,27,74,0.98)' : 'rgba(13,27,74,0.95)';
});
