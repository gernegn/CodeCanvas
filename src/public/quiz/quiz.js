// ===========================
//  QUIZ LOGIC — quiz.js
// ===========================

// -------------------------------------------------------
// DATA: คำถาม + ตัวเลือก + คะแนน (L = ซ้าย, R = ขวา)
// -------------------------------------------------------

const questions = [
  {
    id: 1,
    topic: 'นำทาง',
    text: 'เวลาคุณต้องไปในสถานที่ที่ไม่เคยไปมาก่อน คุณมักจะใช้วิธีไหนในการนำทาง?',
    img: 'img-elements/q1.png',
    choices: [
      { text: 'ขับไปตามสัญชาตญาณ เห็นป้ายแล้วค่อยตัดสินใจ',                    score: { L: 0, R: 1 } },
      { text: 'เปิด Google Maps แล้วดูลิสต์ลำดับถนนที่จะต้องเลี้ยวอย่างละเอียด', score: { L: 1, R: 0 } },
      { text: 'มองภาพรวมในแผนที่แล้วจำจุดสังเกตใหญ่ ๆ เอา',                      score: { L: 0, R: 1 } },
    ],
  },
  {
    id: 2,
    topic: 'วาดบ้าน',
    text: 'ถ้าคุณต้องวาดแปลนบ้านในฝันของตัวเอง คุณจะเริ่มต้นอย่างไร?',
    img: 'img-elements/q2.png',
    choices: [
      { text: 'วางผังห้องทีละห้องตามหน้าที่ใช้งานอย่างเป็นระบบ',
        score: { L: 1, R: 0 } },
      { text: 'วาดภาพรวมภายนอกที่สวยงามก่อนแล้วค่อยแบ่งพื้นที่ภายใน',
        score: { L: 0, R: 1 } },
      { text: 'ร่างโซนที่ชอบคร่าว ๆ แล้วตกแต่งสไตล์ไปพร้อมกัน',
        score: { L: 0, R: 1 } },
    ],
  },
  {
    id: 3,
    topic: 'ตู้ DIY',
    text: 'คุณได้กล่องตู้ DIY มา มีคู่มือและชิ้นส่วนครบ คุณจะทำอย่างไรก่อน?',
    img: 'img-elements/q3.png',
    choices: [
      { text: 'อ่านคู่มือทีละขั้นตอน ทำตามลำดับที่กำหนดอย่างเคร่งครัด', score: { L: 1, R: 0 } },
      { text: 'ดูรูปผลลัพธ์สุดท้ายก่อน แล้วลองประกอบตามที่จินตนาการ', score: { L: 0, R: 1 } },
      { text: 'แยกชิ้นส่วนออกเป็นหมวดหมู่ก่อนแล้วค่อยวางแผน', score: { L: 1, R: 0 } },
    ],
  },
  {
    id: 4,
    topic: 'บอกทางเพื่อน',
    text: 'เพื่อนขอให้คุณอธิบายทางไปสถานที่แห่งหนึ่ง คุณจะบอกยังไง?',
    img: 'img-elements/q4.png',
    choices: [
      { text: 'บอกชื่อถนน ระยะทาง และทิศทางเป็นขั้นตอน เช่น เลี้ยวซ้าย 200 เมตร', score: { L: 1, R: 0 } },
      { text: 'วาดแผนที่คร่าว ๆ ให้ดู',                                                score: { L: 0, R: 1 } },
      { text: 'บอกจุดสังเกต เช่น เลี้ยวตรงที่มีร้านสีแดง ๆ',                   score: { L: 0.5, R: 0.5 } },
    ],
  },
  {
    id: 5,
    topic: 'เขาวงกต',
    text: 'คุณต้องหาทางออกจากเขาวงกตคุณจะใช้วิธีไหน?',
    img: 'img-elements/q5.png',
    choices: [
      { text: 'เดินชิดกำแพงด้านใดด้านหนึ่งตลอด', score: { L: 0, R: 1 } },
      { text: 'จดจำทางที่เดินไปแล้วเป็นระบบ เพื่อไม่ให้วนซ้ำ',        score: { L: 1, R: 0 } },
      { text: 'มองภาพรวมจากมุมสูง (ถ้าทำได้) แล้วค่อยวางเส้นทาง', score: { L: 0, R: 1 } },
    ],
  },
  {
    id: 6,
    topic: 'ลูกศร/คำ',
    text: 'เห็นป้ายที่มีลูกศรชี้ไปทางขวา แต่เขียนว่า "ซ้าย" คุณรู้สึกอย่างไร?',
    img: 'img-elements/q6.png',
    choices: [
      { text: 'สับสนแป๊บนึง แต่สมองเลือกตามรูปภาพ(ลูกศร) ทันที',
        score: { L: 0.5, R: 0.5 } },
      { text: 'อ่านคำว่า "ซ้าย" แล้วสมองประมวลผลตามตัวหนังสือ',
        score: { L: 1, R: 0 } },
      { text: 'ตีความลูกศรได้เร็วกว่า รู้สึกว่าภาพสำคัญกว่าคำ' ,
        score: { L: 0, R: 1 } },
    ],
  },
  {
    id: 7,
    topic: 'ที่จอดรถ',
    text: 'ถ้าคุณจอดรถในห้างใหญ่ที่ไม่คุ้นเคย จะจำตำแหน่งรถยังไง?',
    img: 'img-elements/q7.png',
    choices: [
      { text: 'จำโซน ชั้น และหมายเลขช่องจอดเป็นรหัส เช่น B2-45',       score: { L: 1, R: 0 } },
      { text: 'ถ่ายรูปป้ายบอกตำแหน่งเอาไว้',                            score: { L: 0, R: 1 } },
      { text: 'จำสัญลักษณ์หรือสีของโซนนั้น เช่น ใกล้เสาสีเขียว',
        score: { L: 0.5, R: 0 } },
    ],
  },
];

// -------------------------------------------------------
// RESULTS
// -------------------------------------------------------
const RESULTS = {
  L: {
    type: 'The Logic Architect',
    subtitle: 'สายตรรกะเป๊ะ',
    desc: 'คุณคือยอดนักวางแผนที่มีระเบียบวินัยในความคิดสูงมาก สมองซีกซ้ายทำงานเหมือนคอมพิวเตอร์ที่ประมวลผลเป็นขั้นตอนแม่นยำ',
    strengths: 'การลำดับขั้นตอน • การแก้ปัญหาด้วยตรรกะ • ความละเอียดถี่ถ้วน',
    cta: 'ทักษะการคิดแบบ Algorithm ของคุณคืออาวุธลับ! ใน CodeCanvas คุณจะสามารถเขียนรหัสควบคุมทุกอย่างได้อย่างไร้ที่ติ',
    brain: 'brain_left.png',
  },
  R: {
    type: 'The Visual Visionary',
    subtitle: 'สายจินตนาการล้ำ',
    desc: 'คุณมองโลกผ่านภาพและมิติสัมพันธ์ สมองซีกขวาทรงพลังในการจินตนาการถึงผลลัพธ์สุดท้ายก่อนที่มันจะเกิดขึ้นจริง',
    strengths: 'มิติสัมพันธ์ • การมองภาพรวม • ความคิดสร้างสรรค์',
    cta: 'คุณคือศิลปินที่ใช้จินตนาการนำทาง! มาลองดูว่าทักษะการมองภาพในหัวจะเปลี่ยนเป็นงานศิลปะผ่าน Code ใน CodeCanvas ได้สนุกแค่ไหน',
    brain: 'brain_right.png',
  },
  BOTH: {
    type: 'The Whole-Brain Master',
    subtitle: 'อัจฉริยะสมองสมดุล',
    desc: 'คุณคือส่วนผสมที่หาตัวจับยาก! สามารถใช้ทั้งศาสตร์ (ตรรกะ) และศิลป์ (จินตนาการ) ทำงานร่วมกันได้อย่างยอดเยี่ยม',
    strengths: 'ความยืดหยุ่นในการคิด • เปลี่ยนภาพร่างให้เป็นขั้นตอนจริงได้ลื่นไหล',
    cta: 'คุณคือตัวจริงที่ CodeCanvas ตามหา! เพราะเกมนี้ออกแบบมาเพื่อคนที่บาลานซ์สมองทั้งสองซีกได้อย่างคุณโดยเฉพาะ',
    brain: 'brain_both.png',
  },
};

// -------------------------------------------------------
// STATE
// -------------------------------------------------------
let currentIndex   = 0;
let currentShuffled = [];  // เก็บ choices ที่สุ่มแล้วของข้อปัจจุบัน
const userAnswers  = new Array(questions.length).fill(null);

// -------------------------------------------------------
// DOM REFS
// -------------------------------------------------------
const progressFill     = document.getElementById('progressFill');
const questionNumber   = document.getElementById('questionNumber');
const questionText     = document.getElementById('questionText');
const questionImg      = document.getElementById('questionImg');
const choicesContainer = document.getElementById('choicesContainer');
const btnPrev          = document.getElementById('btnPrev');
const btnNext          = document.getElementById('btnNext');

// เพิ่มฟังก์ชันนี้ไว้ด้านบนไฟล์ ใกล้กับ shuffleArray
function smoothScrollTo(targetY, duration = 800) {
  const startY  = window.scrollY || document.documentElement.scrollTop;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// -------------------------------------------------------
// UTILS
// -------------------------------------------------------
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// -------------------------------------------------------
// RENDER QUESTION
// -------------------------------------------------------
function renderQuestion(index) {
  // Scroll ขึ้นบนทุกครั้งที่เปลี่ยนข้อ
  document.querySelector('.quiz-card').scrollTo({ top: 0, behavior: 'smooth' });

  const cardTop = document.querySelector('.quiz-card').getBoundingClientRect().top + window.scrollY - 20;
  smoothScrollTo(cardTop, 1200); // 800ms = ช้าลงนุ่มขึ้น ปรับเลขได้เลยค่ะ

  const q = questions[index];

  // Progress bar
  const pct = (index / questions.length) * 100;
  progressFill.style.width = pct + '%';

  // Text & Image
  questionNumber.textContent = `คำถามที่ ${q.id}`;
  questionText.textContent   = q.text;
  questionImg.src            = q.img;
  questionImg.alt            = q.topic;

  // Choices — สุ่มตำแหน่ง แล้วเก็บไว้ใน currentShuffled
  choicesContainer.innerHTML = '';
  currentShuffled = shuffleArray(q.choices);

  currentShuffled.forEach((choice) => {
    const originalIndex = q.choices.indexOf(choice);

    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.textContent = choice.text;

    // ถ้าข้อนี้เคยตอบแล้ว ให้ highlight ไว้
    if (userAnswers[index] === originalIndex) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      selectChoice(originalIndex);
    });

    choicesContainer.appendChild(btn);
  });

  // Nav buttons
  btnPrev.disabled = index === 0;
  updateNextBtn(index);
}

// -------------------------------------------------------
// SELECT CHOICE
// -------------------------------------------------------
function selectChoice(choiceIndex) {
  userAnswers[currentIndex] = choiceIndex;

  // Highlight ปุ่มที่เลือก โดยเทียบจาก originalIndex
  const q = questions[currentIndex];
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    const originalIndex = q.choices.indexOf(currentShuffled[i]);
    btn.classList.toggle('selected', originalIndex === choiceIndex);
  });

  updateNextBtn(currentIndex);
}

// -------------------------------------------------------
// UPDATE NEXT BUTTON
// -------------------------------------------------------
function updateNextBtn(index) {
  const isLast   = index === questions.length - 1;
  const answered = userAnswers[index] !== null;

  btnNext.innerHTML = isLast
    ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
       </svg>`
    : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
       </svg>`;

  btnNext.disabled = !answered;
}

// -------------------------------------------------------
// NAVIGATION
// -------------------------------------------------------
btnPrev.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
  }
});

btnNext.addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  } else {
    showResult();
  }
});

// -------------------------------------------------------
// CALCULATE SCORE
// -------------------------------------------------------
function calculateScore() {
  let L = 0, R = 0;

  questions.forEach((q, qi) => {
    const ans = userAnswers[qi];
    if (ans === null) return;
    const s = q.choices[ans].score;
    L += s.L;
    R += s.R;
  });

  return { L, R };
}

// -------------------------------------------------------
// SHOW RESULT
// -------------------------------------------------------
function showResult() {
  const { L, R } = calculateScore();

  let resultKey;
  if (L >= 5)      resultKey = 'L';
  else if (R >= 5) resultKey = 'R';
  else             resultKey = 'BOTH';

  window.location.href = `result.html?type=${resultKey}&L=${L}&R=${R}`;
}

// -------------------------------------------------------
// INIT
// -------------------------------------------------------
renderQuestion(0);
