const RESULTS = {
  L: {
    type:       'The Logic Architect',
    subtitle:   'คุณคือสายตรรกะเป๊ะ\nสมองของคุณโดดเด่นในฝั่งซ้าย',
    desc:       'คุณคือยอดนักวางแผนที่มีระเบียบวินัยในความคิดสูงมาก\nสมองซีกซ้ายของคุณทำงานเหมือนคอมพิวเตอร์ที่ประมวลผล\nเป็นขั้นตอนแม่นยำ',
    strengths:  'คือเก่งเรื่องการลำดับขั้นตอน, การแก้ปัญหาด้วยตรรกะ และความละเอียดถี่ถ้วน',
    brain:      'img-elements/brain_left.png',
    icon:       'img-elements/code.png',
    colorClass: 'type-L',
  },
  R: {
    type:       'The Visual Visionary',
    subtitle:   'คุณคือสายจินตนาการล้ำ\nสมองของคุณโดดเด่นในฝั่งขวา',
    desc:       'คุณมองโลกผ่านภาพและมิติสัมพันธ์ สมองซีกขวาของคุณทรงพลังในการจินตนาการถึงผลลัพธ์สุดท้ายได้ก่อนที่มันจะเกิดขึ้นจริง',
    strengths:  'คือเก่งเรื่องมิติสัมพันธ์, การมองภาพรวม และความคิดสร้างสรรค์',
    brain:      'img-elements/brain_right.png',
    icon:       'img-elements/paint.png',
    colorClass: 'type-R',
  },
  BOTH: {
    type:       'The Whole-Brain Master',
    subtitle:   'คุณคืออัจฉริยะสมองสมดุล\nสมองของคุณโดดเด่นทั้งสองฝั่ง',
    desc:       "คุณคือส่วนผสมที่หาตัวจับยาก! สามารถใช้ทั้ง 'ศาสตร์' (ตรรกะ) และ 'ศิลป์' (จินตนาการ) ทำงานร่วมกันได้\nอย่างยอดเยี่ยม",
    strengths:  'มีความยืดหยุ่นในการคิด สามารถเปลี่ยนจากภาพร่างในหัว\nให้กลายเป็นขั้นตอนการทำจริงได้อย่างลื่นไหล',
    brain:      'img-elements/brain_both.png',
    icon:       'img-elements/brain.png',
    colorClass: 'type-BOTH',
  },
};

const IG_W   = 1080;
const IG_H   = 1920;
const CARD_W = 480;

const params    = new URLSearchParams(window.location.search);
const resultKey = params.get('type') || 'BOTH';
const result    = RESULTS[resultKey] || RESULTS['BOTH'];

document.getElementById('resultBrainImg').src           = result.brain;
document.getElementById('resultTypeName').textContent   = result.type;
document.getElementById('resultTypeSubtitle').innerHTML = result.subtitle.replace('\n', '<br>');
document.getElementById('resultDesc').textContent       = result.desc;
document.getElementById('resultStrengths').textContent  = result.strengths;
document.getElementById('resultTypeIcon').src           = result.icon;
document.getElementById('resultTypeBox').classList.add(result.colorClass);

const loadImg = (src) => new Promise((resolve) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload  = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = src;
});

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
}

document.getElementById('btnSave').addEventListener('click', async () => {
  const btn  = document.getElementById('btnSave');
  const card = document.getElementById('resultCard');

  btn.disabled = true;
  btn.style.opacity = '0.5';
  const originalHTML = btn.innerHTML; // จำหน้าตาปุ่มเดิมเอาไว้
  btn.innerHTML = 'กำลังเตรียมรูปภาพ...';

  const isMobile = window.innerWidth <= 768;
  const paddingBottom = isMobile ? '80px' : '32px';

  const ghost = document.createElement('div');
  ghost.className = card.className + ' capture-mode';
  ghost.style.cssText = [
    'position:fixed',
    'top:-99999px',
    'left:0',
    `width:${CARD_W}px`,
    'background:#fff',
    'box-sizing:border-box',
    'overflow:visible',
    'z-index:-1',
    'border-radius:40px',
  ].join(';');

  ghost.innerHTML = card.innerHTML;

  // ใช้ setProperty + 'important' เพื่อ override !important ใน CSS
  ghost.style.setProperty('padding-bottom', paddingBottom, 'important');

  ghost.style.animation  = 'none';
  ghost.style.transition = 'none';
  ghost.querySelectorAll('*').forEach(el => {
    el.style.animation  = 'none';
    el.style.transition = 'none';
  });

  document.body.appendChild(ghost);

  const ghostImages = Array.from(ghost.querySelectorAll('img'));
  await Promise.all(ghostImages.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload  = resolve;
      img.onerror = resolve;
    });
  }));

  await new Promise(r => setTimeout(r, 400));

  const fullHeight = ghost.scrollHeight;
  ghost.style.height = fullHeight + 'px';

  try {
    // const captureScale = isMobile ? 1 : 2;
    const cardCanvas = await html2canvas(ghost, {
      scale:           2,
      useCORS:         true,
      backgroundColor: null,
      logging:         false,
      width:           CARD_W,
      height:          fullHeight,
      windowWidth:     1200,
    });

    document.body.removeChild(ghost);

    const igCanvas  = document.createElement('canvas');
    igCanvas.width  = IG_W;
    igCanvas.height = IG_H;
    const ctx = igCanvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, IG_H);
    gradient.addColorStop(0, '#31BEF3');
    gradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, IG_W, IG_H);

    const [c1, c2, c3, c4, wink, clover] = await Promise.all([
      loadImg('img-elements/cloud_01.png'),
      loadImg('img-elements/cloud_02.png'),
      loadImg('img-elements/cloud_03.png'),
      loadImg('img-elements/cloud_04.png'),
      loadImg('img-elements/wink.png'),
      loadImg('img-elements/Clover.png'),
    ]);

  // วาดก้อนเมฆในตำแหน่งที่เหมาะสม (หลบขอบการ์ด)
    if (c2) ctx.drawImage(c2, -50,  150,  320, 220); // ขยับขึ้นและเข้าใน
    if (c3) ctx.drawImage(c3, 850,  200,  300, 200); // ขยับขึ้นและเข้าใน
    if (c1) ctx.drawImage(c1, -150, 1300, 400, 280); // อยู่ใต้การ์ด
    if (c4) ctx.drawImage(c4, 900,  1450, 350, 240); // อยู่ใต้การ์ด

    // วาดดาวระยิบระยับ (ขยับให้หลบมุมการ์ด)
    if (wink) {
      ctx.drawImage(wink, 100, 350,  60, 60);  // ขยับหลบ
      ctx.drawImage(wink, 950, 650,  50, 50);  // ขยับหลบ
      ctx.drawImage(wink, 150, 1550, 40, 40); // อยู่ใต้การ์ด
    }

    // วาดพื้นหญ้า (โค้ดเดิม)
    ctx.fillStyle = '#B4E642';
    ctx.beginPath();
    ctx.moveTo(0, IG_H);
    ctx.lineTo(0, IG_H - 260);
    ctx.quadraticCurveTo(IG_W / 2, IG_H - 420, IG_W, IG_H - 260);
    ctx.lineTo(IG_W, IG_H);
    ctx.closePath();
    ctx.fill();

    // วาด Clover (ขยับให้หลบมุมการ์ด)
    if (clover) {
      ctx.drawImage(clover, 80,         IG_H - 250, 130, 130); // ขยับเข้าใน
      ctx.drawImage(clover, IG_W - 180, IG_H - 220, 110, 110); // ขยับเข้าใน
    }

    // const cardH     = cardCanvas.height;
    // const cardW_out = cardCanvas.width;
    // const startX    = Math.round((IG_W - cardW_out) / 2);
    // const startY    = Math.max(0, Math.round((IG_H - cardH) / 2));
    // const RADIUS    = 80;

    // ctx.save();
    // ctx.shadowColor   = 'rgba(0, 0, 0, 0.1)';
    // ctx.shadowBlur    = 40;
    // ctx.shadowOffsetY = 15;

    // roundedRect(ctx, startX, startY, cardW_out, cardH, RADIUS);
    // ctx.clip();
    // ctx.drawImage(cardCanvas, startX, startY, cardW_out, cardH);
    // ctx.restore();

    // ==========================================
    // 🟢 แก้ไข: บังคับขยายการ์ดให้สวยงามเสมอ ไม่บีบ/ไม่ยืด
    // ==========================================

    // 1. กำหนดความกว้างของการ์ดให้ใหญ่เกือบเต็มกรอบ 1080px (960px คือสัดส่วนที่สวยที่สุด)
    const targetCardWidth = 960;

    // 2. คำนวณสัดส่วนการขยาย เพื่อให้ความสูงยืดตามความกว้างเป๊ะๆ (ป้องกันภาพบีบ)
    const scaleFactor = targetCardWidth / cardCanvas.width;
    const finalCardWidth = targetCardWidth;
    const finalCardHeight = cardCanvas.height * scaleFactor;

    // 3. คำนวณจุดกึ่งกลางหน้าจอ
    const startX = Math.round((IG_W - finalCardWidth) / 2);
    const startY = Math.max(0, Math.round((IG_H - finalCardHeight) / 2));

    // 4. กำหนดความโค้งมุมที่ 80px (ซึ่งจะดูมนสวยงามพอดีกับขนาดการ์ด 960px)
    const finalRadius = 80;

    ctx.save();
    ctx.shadowColor   = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur    = 40;
    ctx.shadowOffsetY = 15;

    // วาดกรอบและรูปด้วยขนาดใหม่ที่คำนวณไว้
    roundedRect(ctx, startX, startY, finalCardWidth, finalCardHeight, finalRadius);
    ctx.clip();
    ctx.drawImage(cardCanvas, startX, startY, finalCardWidth, finalCardHeight);
    ctx.restore();
    // ==========================================

    const dataURL  = igCanvas.toDataURL('image/png');
    const base64   = dataURL.split(',')[1];
    const now = new Date();
    const date = now.toISOString().slice(0, 10);           // 2026-03-06
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // 11-54-39
    const filename = `CodeCanvas_BrainQuiz_${date}_${time}`;
// → CodeCanvas_BrainQuiz_2026-03-06_11-54-39.png



    await fetch('save.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: base64, filename }),
    });

    const link    = document.createElement('a');
    link.download = filename;
    link.href     = dataURL;
    link.click();

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerHTML = originalHTML;

  } catch (err) {
    console.error('Save error:', err);
    if (document.body.contains(ghost)) document.body.removeChild(ghost);
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent   = 'เกิดข้อผิดพลาด ลองใหม่';
  }
});
