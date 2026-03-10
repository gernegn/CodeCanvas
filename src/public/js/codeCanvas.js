const appURL = "https://codecanvas.iappsilpakorn.com";

const canvas = document.getElementById('gameCanvas'); // canvas - หน้า main-game
let ctx = null;
if (canvas) ctx = canvas.getContext('2d');

// Buttons & UI
const btnForward = document.querySelector('.bt-forward-item');
const btnLeft = document.querySelector('.bt-left-item');
const btnRight = document.querySelector('.bt-right-item');
const btnReset = document.querySelector('.reset');
const btnUndo = document.querySelector('.bt-undo');
const btnRedo = document.querySelector('.bt-redo');
const btnRun = document.querySelector('.run');
const codeBox = document.querySelector('.code-box');
const boxCode = document.querySelector('.box-code');
const frameImg = document.querySelector('.frame-img');
const challengeTitle = document.querySelector('h1.challenge');
const frameResult = document.querySelector('.frame-result');
const btnRestartAni = document.querySelector('.bt-restart');
const btnRandom = document.querySelector('.bt-random');
const btnRandomBox = document.querySelector('.btn-random-box');
const textRandom = document.querySelector('.text-random');
const numRandomDisplay = document.querySelector('.num-random');
const modal = document.getElementById("randomModal");
const btnConfirm = document.querySelector('.confirm');
const customModal = document.getElementById('customSuccessModal');

// --- Game Variables ---
const gridSize = window.innerWidth >= 1920 ? 20 : 25; // ปรับของทีวีจาก 20 เป็น 16 เพื่อให้ภาพมีระยะห่างจากขอบจอมากขึ้นconst dotSize = window.innerWidth >= 1920 ? 1.5 : 2; // ลดขนาดจุดพื้นหลังในจอทีวี
const dotSize = window.innerWidth >= 1920 ? 1.5 : 2;
const minPadding = 15;
let dot = { x: 0, y: 0, angle: 0 };
let gridOffset = { x: 0, y: 0 };
let pathHistory = [];
let redoStack = [];
let currentChallengeData = null;
let startGridPos = { x: 5, y: 19 };
let resultAnimationTimer = null;
let randomQuota = 2;
let allChallenges = [];
let validPaths = [];

// --- Timing Variables ---
let isGameStarted = false;
let gameStartTimeObj = null;
let gameStartTimeString = "";

// --- Custom Page Variables ---
let currentSelectedColorId = null;
let currentSelectedColorName = 'Default';
let currentSelectedTexture = null;
let currentChallengeIdForCustom = null;
let currentResultImageName = "";

// ตัวแปรเก็บ Timer ของกล่องข้อความ เพื่อไม่ให้มันตีกันถ้าวาดเร็วเกินไป
let cheerTimer = null;

// ตัวแปรนี้เข้าไป เพื่อกันไม่ให้เสียงดังรัวๆ ซ้ำซ้อน
let previousCorrectState = false;

// ==========================================
// Helper: Time & Format
// ==========================================
function recordGameStart() {
    if (!isGameStarted) {
        isGameStarted = true;
        gameStartTimeObj = new Date();
        const d = gameStartTimeObj;
        const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}.${pad(d.getSeconds())}`;
        const dateStr = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        gameStartTimeString = `${timeStr}, ${dateStr}`;
        sessionStorage.setItem('gameStartTimeString', gameStartTimeString);
    }
}

function pad(n) { return n < 10 ? '0' + n : n; }

function calculateDuration() {
    if (!gameStartTimeObj) return 0;
    const endTime = new Date();
    const diffMs = endTime - gameStartTimeObj;
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return parseFloat(`${minutes}.${seconds}`);
}

// ==========================================
// 1. Logic โหลดข้อมูล (Load Data)
// ==========================================
async function loadChallengeData(id) {
    try {
        const responseChallenge = await fetch(`${appURL}/api/challenge/${id}`);
        if (!responseChallenge.ok) throw new Error('Challenge API Error');
        const dataChallenge = await responseChallenge.json();

        let dataTemplate = [];
        try {
            const responseTemplate = await fetch(`${appURL}/api/template/${id}`);
            if (responseTemplate.ok) dataTemplate = await responseTemplate.json();
        } catch (err) { console.warn("Template fallback."); }

        if (dataChallenge) {
            currentChallengeData = dataChallenge;
            if (challengeTitle) challengeTitle.innerText = dataChallenge.Challenge;

            if (frameImg && dataChallenge.Example_Image) {
                frameImg.style.backgroundImage = `url('${appURL}/img/example-image/${dataChallenge.Example_Image}')`;
                frameImg.style.backgroundSize = 'contain';
                frameImg.style.backgroundRepeat = 'no-repeat';
                frameImg.style.backgroundPosition = 'center';
            }

            if (dataTemplate && dataTemplate.length > 0) {
                validPaths = [];
                let firstPathStart = null;

                dataTemplate.forEach(row => {
                    if (row.Code_Point) {
                        const path = parseCoordinates(row.Code_Point);
                        if (path.length > 0) {
                            if (!firstPathStart) firstPathStart = path[0];

                            // จัดตำแหน่งรูปภาพทั้งหมดให้สัมพันธ์กับจุดเริ่มต้นแรก
                            const relativePath = path.map(p => ({
                                x: p.x - firstPathStart.x,
                                y: p.y - firstPathStart.y
                            }));
                            validPaths.push(relativePath);
                        }
                    }
                });

                // สั่ง Setup Canvas ซึ่งมันจะคำนวณจุดกึ่งกลางและเริ่มจากด้านล่างให้อัตโนมัติ
                setupCanvas(0, 0);

            } else {
                setupCanvas(0, 0);
                validPaths = [];
            }

            const savedId = sessionStorage.getItem('storedChallengeID');
            // เช็คเพิ่มว่า URL มีค่า 'play' หรือไม่ เพื่อป้องกันการดึงค่าเก่าตอนเริ่มเล่นใหม่จากการสุ่ม
            const isPlayingNew = window.location.href.includes('play');

            if (savedId && savedId == id && !isPlayingNew) {
                const savedPath = sessionStorage.getItem('userPathHistory');
                if (savedPath) {
                    pathHistory = JSON.parse(savedPath);
                    if (pathHistory && pathHistory.length > 0) {
                        dot = { ...pathHistory[pathHistory.length - 1] };
                        previousCorrectState = true;
                        draw();
                    }
                }
            } else {
                // ล้างข้อมูลการวาดเก่าทิ้งเมื่อเริ่มเล่นเกมใหม่
                sessionStorage.removeItem('userPathHistory');
                sessionStorage.removeItem('rawccv_UserCode');
                sessionStorage.removeItem('rawUserPoint');
                sessionStorage.removeItem('ccv_UserCodeHtml');
            }
        }
    } catch (error) { console.error(error); setupCanvas(0, 0); }
}

function parseCoordinates(str) {
    const path = [];
    if(!str) return path;
    const matches = [...str.matchAll(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)];
    matches.forEach(m => path.push({ x: parseInt(m[1]), y: parseInt(m[2]) }));
    return path;
}

// ==========================================
// 2. Logic การวาด (Canvas)
// ==========================================
function setupCanvas(gridX, gridY) {
    if (!canvas || !ctx) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // คำนวณหาจุดกึ่งกลางของภาพจาก validPaths (เฉลย)
    let drawingCenterX = gridX;
    let drawingCenterY = gridY;

    if (validPaths && validPaths.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        validPaths.forEach(path => {
            path.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            });
        });
        drawingCenterX = (minX + maxX) / 2;
        drawingCenterY = (minY + maxY) / 2;
    }

    // จัดตำแหน่ง Canvas ให้ภาพวาดอยู่ตรงกลางจอ
    gridOffset.x = (canvas.width / 2) - (drawingCenterX * gridSize);
    gridOffset.y = (canvas.height / 2) - (drawingCenterY * gridSize);

    // ปรับเลื่อนให้อยู่ตรงกลาง ไม่เทลงล่างเกินไปสำหรับทีวี
    if (window.innerWidth >= 1920) {
        gridOffset.y += 20; // ✅ ลดจาก 120 เหลือ 20 เพื่อให้ภาพอยู่กึ่งกลางสมดุล ไม่กองอยู่ข้างล่าง
    } else {
        gridOffset.y += 20;  // หน้าจอคอมปกติ
    }

    // กำหนดตำแหน่งเริ่มต้นผู้เล่น (บังคับจุดเริ่มจากโค้ดสัมพัทธ์)
    startGridPos.x = 0;
    startGridPos.y = 0;

    const startX = gridOffset.x;
    const startY = gridOffset.y;

    dot = { x: startX, y: startY, angle: 0 };
    pathHistory = [{ x: dot.x, y: dot.y, angle: dot.angle }];
    redoStack = [];
    if (codeBox) codeBox.innerHTML = '';

    isGameStarted = false;
    gameStartTimeObj = null;

    updateRunButtonState(false);

    // ปลดล็อคปุ่มให้กลับมากดได้ปกติเมื่อตั้งกระดานใหม่
    toggleGameControls(false);

    draw();
}

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. วาดจุด Grid (พื้นหลัง) ให้เต็มจออย่างสม่ำเสมอ
    ctx.fillStyle = '#fddfb3ff';
    let startGridX = gridOffset.x % gridSize;
    let startGridY = gridOffset.y % gridSize;

    // ปรับค่าให้จุดเริ่มวาดจากขอบซ้ายบนสุดของจอเสมอ
    if (startGridX < 0) startGridX += gridSize;
    if (startGridY < 0) startGridY += gridSize;

    for (let x = startGridX - gridSize; x <= canvas.width + gridSize; x += gridSize) {
        for (let y = startGridY - gridSize; y <= canvas.height + gridSize; y += gridSize) {
            ctx.beginPath(); ctx.arc(x, y, dotSize, 0, Math.PI * 2); ctx.fill();
        }
    }

    // 2. วาดเส้นที่เดิน (Path)
    if (pathHistory.length > 0) {
        ctx.beginPath(); ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.moveTo(pathHistory[0].x, pathHistory[0].y);
        for (let i = 1; i < pathHistory.length; i++) ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
        ctx.stroke();
    }

    // 3. วาดตัวผู้เล่น (สามเหลี่ยม)
    ctx.save(); ctx.translate(dot.x, dot.y); ctx.rotate(((dot.angle - 90) * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-7, 6); ctx.lineTo(-5, 0); ctx.lineTo(-7, -6);
    ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();

    validatePathWithDB();
    updateCodeBox();
}

function getCleanPath() {
    // ฟังก์ชันนี้ถูกปรับเพื่อให้บันทึกพิกัดแบบ "สัมพัทธ์ (Relative)"
    // ทำให้โค้ดตรวจจับได้แม่นยำ ไม่ว่าคุณจะเริ่มวาดจากจุดไหนบนจอทีวีก็ตาม
    const fullPath = pathHistory.map(p => ({
        x: Math.round((p.x - gridOffset.x) / gridSize) - startGridPos.x,
        y: Math.round((p.y - gridOffset.y) / gridSize) - startGridPos.y
    }));

    const uniquePath = [];
    if (fullPath.length > 0) {
        uniquePath.push(fullPath[0]);
        for (let i = 1; i < fullPath.length; i++) {
            const prev = uniquePath[uniquePath.length - 1];
            const curr = fullPath[i];
            if (curr.x !== prev.x || curr.y !== prev.y) {
                uniquePath.push(curr);
            }
        }
    }
    return uniquePath;
}


// ฟังก์ชันสำหรับ เปิด/ปิด การใช้งานปุ่มควบคุมทั้งหมด
function toggleGameControls(disable) {
    // รวมปุ่มทั้งหมดที่ต้องการล็อคเมื่อถึง 100%
    const controls = [btnForward, btnLeft, btnRight, btnUndo, btnRedo, btnReset];

    controls.forEach(btn => {
        if (btn) {
            if (disable) {
                btn.style.pointerEvents = 'none'; // ปิดไม่ให้คลิกได้
                btn.style.opacity = '0.5';        // ทำให้สีจางลงเพื่อให้รู้ว่ากดไม่ได้แล้ว
            } else {
                btn.style.pointerEvents = 'auto'; // คืนค่าให้คลิกได้ตามปกติ
                btn.style.opacity = '1';          // คืนสีเดิม
            }
        }
    });
}

function validatePathWithDB() {
    if (!btnRun) return;
    const userGridPath = getCleanPath();
    if (!validPaths || validPaths.length === 0) {
        updateRunButtonState(false);
        previousCorrectState = false;
        updateProgressAndError(0, false); // รีเซ็ต UI
        return;
    }

    let isExactMatch = false;
    let maxMatchCount = 0;
    let isCurrentlyOnTrack = false;
    let targetTotalLength = validPaths[0].length; // ความยาวจุดทั้งหมดของเฉลย

    // วนลูปเช็คว่าเส้นทางที่ผู้เล่นเดิน ตรงกับเส้นทางเฉลยเส้นไหนบ้างไหม?
    validPaths.forEach(targetPath => {
        let matchCount = 0;
        let onThisTrack = true;

        for (let i = 0; i < userGridPath.length; i++) {
            if (i < targetPath.length && userGridPath[i].x === targetPath[i].x && userGridPath[i].y === targetPath[i].y) {
                matchCount++;
            } else {
                onThisTrack = false; // เดินออกนอกเส้นทางแล้ว
                break;
            }
        }

        if (matchCount > maxMatchCount) maxMatchCount = matchCount;
        if (onThisTrack) isCurrentlyOnTrack = true; // ยืนยันว่ากำลังมาถูกทาง
        if (onThisTrack && userGridPath.length === targetPath.length) isExactMatch = true; // เดินครบและถูก 100%
    });

    // ✅ คำนวณเปอร์เซ็นต์
    let percent = 0;
    if (targetTotalLength > 1) {
        // หักจุดเริ่มต้นออก (นับเฉพาะเส้นที่เดิน)
        percent = Math.floor(((maxMatchCount - 1) / (targetTotalLength - 1)) * 100);
    }
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    // ✅ เช็คว่าเกิดข้อผิดพลาดไหม (เดินออกนอกเส้นทางเฉลย)
    const hasError = userGridPath.length > 1 && !isCurrentlyOnTrack;

    // อัปเดต UI เปอร์เซ็นต์ และ Popup แจ้งเตือน
    updateProgressAndError(percent, hasError);

    // เรื่องเสียงและปุ่ม RUN
    if (isExactMatch && !previousCorrectState) {
        const successSound = document.getElementById('successSound');
        if (successSound) {
            successSound.currentTime = 0;
            successSound.volume = 0.2;
            successSound.play().catch(e => console.error("เล่นเสียงไม่ได้:", e));
        }
    }

    previousCorrectState = isExactMatch;
    updateRunButtonState(isExactMatch);

    // ถ้า isExactMatch เป็น true (100%) ให้ล็อคปุ่มทั้งหมด
    toggleGameControls(isExactMatch);
}

// ✅ ฟังก์ชันสำหรับอัปเดต UI แจ้งเตือนและเปอร์เซ็นต์
function updateProgressAndError(percent, hasError) {
    // 1. อัปเดตวงกลมเปอร์เซ็นต์
    const progressCircle = document.getElementById('progressCircle');
    const innerText = document.querySelector('.inner-circle');

    // ดึงค่าเก่าก่อนอัปเดตเพื่อเช็คว่าเปอร์เซ็นต์เปลี่ยนไหม
    const oldPercent = parseInt(innerText ? innerText.innerText : "0");

    if (progressCircle && innerText) {
        innerText.innerText = `${percent}%`;
        progressCircle.style.background = `conic-gradient(#bce051 ${percent}%, #ffffff ${percent}%)`;
    }

    // 2. ตรวจสอบการแสดงกล่องให้กำลังใจ (Cheer Tooltip)
    const cheerTooltip = document.getElementById('cheerTooltip');
    if (cheerTooltip && percent !== oldPercent) {
        let message = "";

        // เช็คเงื่อนไขและเปลี่ยนข้อความตามเปอร์เซ็นต์ที่กำหนด
        if (percent === 50) {
            message = "มาถึงครึ่งทางแล้ว สู้ๆ !";
        } else if (percent === 75) {
            message = "อีกนิดเดียว คุณทำได้ !";
        } else if (percent === 100) {
            message = "เย้! สำเร็จแล้ว";
        }

        if (message !== "") {
            cheerTooltip.innerText = message;
            cheerTooltip.classList.add('show');

            // ตั้งเวลาให้กล่องหายไปเองใน 3 วินาที (ถ้ามีอันเก่าค้างอยู่ให้ลบทิ้งก่อน)
            if (cheerTimer) clearTimeout(cheerTimer);
            cheerTimer = setTimeout(() => {
                cheerTooltip.classList.remove('show');
            }, 3000);
        }
    }

    // 3. อัปเดต Popup แจ้งเตือนข้อผิดพลาด
    const tooltip = document.getElementById('errorTooltip');
    if (tooltip) {
        if (hasError) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            // ขยับ Popup ไปไว้บนหัวจุดที่กำลังอยู่พอดี
            tooltip.style.left = `${dot.x}px`;
            tooltip.style.top = `${dot.y - 15}px`;
        } else {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }
    }
}

function updateRunButtonState(isEnabled) {
    if (!btnRun) return;
    if (isEnabled) {
        btnRun.style.backgroundColor = "#000000"; btnRun.style.color = "#ffffff"; btnRun.style.cursor = "pointer"; btnRun.disabled = false;
    } else {
        btnRun.style.backgroundColor = "#989898"; btnRun.style.color = "black"; btnRun.style.cursor = "not-allowed"; btnRun.disabled = true;
    }
}

// ✅ ฟังก์ชัน: บันทึก ccv_UserCode และจำ ID (ใช้ตอนกดปุ่ม RUN)
async function saveccv_UserCodeAndStoreId() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const userCommands = Array.from(codeBox.querySelectorAll('.code-item')).map(item => item.innerText).join(', ');
    const cleanPath = getCleanPath();
    const userPoints = cleanPath.map(p => `(${p.x}, ${p.y})`).join(', ');

    const payload = {
        User_ID: 1, // ค่าชั่วคราว
        User_Code: userCommands,
        User_Point: userPoints,
        Color_Name: "Default",
        Texture_Name: currentChallengeData ? currentChallengeData.Challenge : "None"
    };

    try {
        const response = await fetch(`${appURL}/api/save-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.id) {
            sessionStorage.setItem('lastccv_UserCodeID', data.id);
            console.log("📝 Created ccv_UserCode ID:", data.id);
        }

        return response.ok;
    } catch (error) {
        console.error("Network Error:", error);
        return false;
    }
}

// ✅ 1. เพิ่มตัวแปรและ Event ล็อกการ Scroll กล่องโค้ด
let maxAllowedScrollX = 0;
if (codeBox) {
    codeBox.addEventListener('scroll', () => {
        // ถ้าผู้เล่นพยายามเลื่อนขวาเกินจุดที่อนุญาต ให้บังคับดึงกลับมา
        if (codeBox.scrollLeft > maxAllowedScrollX + 1) {
            codeBox.scrollLeft = maxAllowedScrollX;
        }
    });
}

// ==========================================
// อัปเดตกล่องโค้ด วาดกล่องเส้นประทิ้งไว้จนจบ
// และโชว์ตัวเลขเฉพาะ "ปุ่มล่าสุดที่ถูกกดติดกัน"
// ==========================================
function updateCodeBox() {
    if (!codeBox) return;
    codeBox.innerHTML = '';

    let groupedCommands = [];

    // 1. จัดกลุ่มคำสั่งที่ผู้เล่นกดไปแล้วตามลำดับ
    for (let i = 1; i < pathHistory.length; i++) {
        const current = pathHistory[i];
        const prev = pathHistory[i - 1];

        let type = "";
        let className = "";
        let isRotation = false;
        let commandValue = 0;

        if (current.angle !== prev.angle) {
            isRotation = true;
            let diff = current.angle - prev.angle;

            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            let mathDiff = -diff;

            if (mathDiff > 0) {
                type = "moveLeft";
                className = "item-moveleft";
                commandValue = mathDiff;
            } else if (mathDiff < 0) {
                type = "moveRight";
                className = "item-moveright";
                commandValue = mathDiff;
            }
        } else {
            type = "forward";
            className = "item-forward";
            commandValue = 1;
        }

        let lastCommand = groupedCommands[groupedCommands.length - 1];

        if (lastCommand && lastCommand.type === type) {
            if (isRotation) {
                lastCommand.value += commandValue;
                if (Math.abs(lastCommand.value) >= 360) {
                    lastCommand.value = lastCommand.value % 360;
                }
            } else {
                lastCommand.value += commandValue;
            }
        } else {
            if (isRotation && commandValue === 0) continue;
            groupedCommands.push({ type, className, value: commandValue, isRotation });
        }
    }

    // ✅ 2. ดึงค่าจาก "คำสั่งล่าสุด" (กลุ่มสุดท้าย) มาแสดงที่ Badge เท่านั้น
    let currentForwardCount = 0;
    let currentLeftDegree = 0;
    let currentRightDegree = 0;

    if (groupedCommands.length > 0) {
        // หยิบคำสั่งก้อนสุดท้ายมาดู
        const lastCmd = groupedCommands[groupedCommands.length - 1];

        if (lastCmd.type === "forward") {
            currentForwardCount = lastCmd.value;
        } else if (lastCmd.type === "moveLeft") {
            currentLeftDegree = lastCmd.value;
        } else if (lastCmd.type === "moveRight") {
            currentRightDegree = Math.abs(lastCmd.value); // แปลงเป็นค่าบวกเสมอ
        }
    }

    // ✅ อัปเดต UI ของ Badge บนปุ่ม (โชว์แค่อันที่กำลังกด นอกนั้นซ่อน)
    const fwdBadge = document.querySelector('.forward-badge');
    const leftBadge = document.querySelector('.left-badge');
    const rightBadge = document.querySelector('.right-badge');

    if (fwdBadge) {
        fwdBadge.innerText = currentForwardCount;
        fwdBadge.style.display = currentForwardCount > 0 ? 'flex' : 'none';
    }
    if (leftBadge) {
        leftBadge.innerText = currentLeftDegree + '°';
        leftBadge.style.display = currentLeftDegree > 0 ? 'flex' : 'none';
    }
    if (rightBadge) {
        rightBadge.innerText = currentRightDegree + '°';
        rightBadge.style.display = currentRightDegree > 0 ? 'flex' : 'none';
    }

    // 3. วาดกล่องคำสั่งที่ผู้เล่นกดแล้วลงบนจอ
    let userGroupedLength = 0;
    groupedCommands.forEach(cmd => {
        if (cmd.isRotation && cmd.value === 0) return;

        const span = document.createElement('span');
        span.className = `code-item actual-code ${cmd.className}`;
        span.innerText = cmd.isRotation ? `${cmd.type}(${cmd.value}°)` : `${cmd.type}(${cmd.value})`;
        codeBox.appendChild(span);
        userGroupedLength++;
    });

    // 4. คำนวณความยาวเฉลย (เพื่อวาดกล่องว่างๆ)
    let targetGroupedLength = 0;
    if (validPaths && validPaths.length > 0) {
        const targetPath = validPaths[0];
        let targetAngle = 0;
        let lastTargetType = "";

        for (let i = 1; i < targetPath.length; i++) {
            const current = targetPath[i];
            const prev = targetPath[i - 1];

            let dx = current.x - prev.x;
            let dy = current.y - prev.y;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (angle < 0) angle += 360;

            let type = "";
            if (angle !== targetAngle) {
                type = "turn";
                targetAngle = angle;
            } else {
                type = "forward";
            }

            if (type !== lastTargetType) {
                targetGroupedLength++;
                lastTargetType = type;
            }
        }
    }

    // 5. วาดกล่องเส้นประ (Placeholder)
    let placeholdersNeeded = targetGroupedLength - userGroupedLength;
    if (placeholdersNeeded <= 0 && (!validPaths || validPaths.length === 0 || pathHistory.length < validPaths[0].length)) {
        placeholdersNeeded = 1;
    }

    for (let p = 0; p < placeholdersNeeded; p++) {
        const placeholder = document.createElement('span');
        placeholder.className = 'code-item code-item-placeholder';
        placeholder.innerText = 'forward(1)';
        codeBox.appendChild(placeholder);
    }

    // 6. ระบบคำนวณและล็อกการเลื่อน (Scroll Lock)
    requestAnimationFrame(() => {
        const actualCodes = codeBox.querySelectorAll('.actual-code');
        const placeholders = codeBox.querySelectorAll('.code-item-placeholder');

        let focusElement = null;

        if (actualCodes.length > 0) {
            focusElement = actualCodes[actualCodes.length - 1];
            if (placeholders.length > 0) {
                focusElement = placeholders[0];
            }
        } else if (placeholders.length > 0) {
            focusElement = placeholders[0];
        }

        if (focusElement) {
            const targetScroll = focusElement.offsetLeft + focusElement.offsetWidth - codeBox.clientWidth + 20;
            maxAllowedScrollX = Math.max(0, targetScroll);
            codeBox.scrollTo({
                left: maxAllowedScrollX,
                behavior: 'smooth'
            });
        } else {
            maxAllowedScrollX = 0;
            codeBox.scrollTo({ left: 0, behavior: 'smooth' });
        }
    });
}

function saveState() { pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle }); redoStack = []; }

// ==========================================
// 3. Custom Page Logic (Validation & Interaction)
// ==========================================

function validateForm() {
    const nameInput = document.getElementById('userNameInput');
    const btnConfirm = document.querySelector('.confirm');

    if (!btnConfirm) return;

    // 1. เช็คชื่อ
    const hasName = nameInput && nameInput.value.trim().length > 0;
    // 2. เช็คสี
    const hasColor = currentSelectedColorId !== null;
    // 3. เช็คลาย
    const hasTexture = currentSelectedTexture !== null && currentSelectedTexture.toLowerCase() !== 'none';

    if (hasName && hasColor && hasTexture) {
        btnConfirm.disabled = false;
    } else {
        btnConfirm.disabled = true;
    }
}

function updateCustomImage() {
    const imgElement = document.getElementById('customResultImg');
    if (!currentChallengeIdForCustom || !imgElement || !currentSelectedColorId || !currentSelectedTexture) return;

    const url = `${appURL}/api/get-texture-image?challenge_id=${currentChallengeIdForCustom}&color_id=${currentSelectedColorId}&texture_name=${currentSelectedTexture}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.image) {
                currentResultImageName = data.image;
                imgElement.src = `${appURL}/img/result-image/${data.image}`;
                imgElement.onload = () => { imgElement.style.opacity = 1; };
            }
        })
        .catch(err => { console.error("❌ Error fetching texture image:", err); });
}

window.selectTexture = function(name, el) {
    document.querySelectorAll('.texture-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

    // ✅ เพิ่มโค้ดเล่นเสียงตอนกดเลือก Texture ตรงนี้แทน
    const btnSound = document.getElementById('buttonSound');
    if (btnSound) {
        btnSound.currentTime = 0;
        btnSound.volume = 0.5;
        btnSound.play().catch(() => {});
    }

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    currentSelectedTexture = formattedName;

    if (currentSelectedColorId === null) {
        currentSelectedColorId = 1;
        currentSelectedColorName = "Yellow";
        const yellowBtn = document.querySelector('.circle-color-item[data-color-id="1"]');
        if(yellowBtn) yellowBtn.classList.add('active');
    }

    updateCustomImage(); // คำสั่งนี้แหละที่ทำหน้าที่ดึงรูปภาพมาแสดง!
    validateForm();
};

// ==========================================
// 4. Save Final Data (ccv_UserCode + ccv_UserGeneral)
// ==========================================
async function saveFinalData() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // 1. ดึง ID ของ ccv_UserCode ที่ได้จากการกดปุ่ม RUN (ต้องมีค่านี้ถึงจะเชื่อมได้)
    const lastccv_UserCodeID = sessionStorage.getItem('lastccv_UserCodeID');

    // ⚠️ เช็คดักไว้เลย ถ้าไม่มี ID แสดงว่า Session หาย หรือข้ามขั้นตอนมา
    if (!lastccv_UserCodeID) {
        console.error("❌ Error: Missing UserCode ID from session.");
        return false;
    }

    // ดึงข้อมูลอื่นๆ
    const rawccv_UserCode = sessionStorage.getItem('rawccv_UserCode') || "";
    const rawUserPoint = sessionStorage.getItem('rawUserPoint') || "";
    const storedDuration = sessionStorage.getItem('gameDuration') || 0;
    const storedStartTime = sessionStorage.getItem('gameStartTimeString') || "";
    const storedChallengeID = sessionStorage.getItem('storedChallengeID');

    const userNameInput = document.getElementById('userNameInput');
    const userName = (userNameInput && userNameInput.value.trim() !== "") ? userNameInput.value.trim() : "Unknown";

    // Fallback Image Logic
    if (!currentResultImageName || currentResultImageName === "") {
        const imgEl = document.getElementById('customResultImg');
        if (imgEl && imgEl.src) currentResultImageName = imgEl.src.split('/').pop();
    }

    // Payload สำหรับ ccv_UserGeneral
    const payloadGeneral = {
        User_Name: userName,
        Challenge_ID: storedChallengeID ? parseInt(storedChallengeID) : null,
        Image: currentResultImageName,
        Timestamp_Min: storedDuration,
        Time: storedStartTime
    };

    try {
        // --- STEP 1: บันทึก ccv_UserGeneral เพื่อเอา ID ใหม่ ---
        const reqGen = await fetch(`${appURL}/api/save-general`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payloadGeneral)
        });

        if (!reqGen.ok) {
            const errData = await reqGen.json();
            throw new Error(errData.error || "Save General Failed");
        }

        const resGen = await reqGen.json();
        const realUserID = resGen.new_user_id;

        if (!realUserID) throw new Error("Failed to get User ID");

        console.log("✅ Got Real User ID:", realUserID);
        console.log("🎨 Sending Color:", currentSelectedColorName);

        // --- STEP 2: ส่ง ID ใหม่ + สี ไปอัปเดตแถว ccv_UserCode เดิม ---
        // ✅ ส่งชื่อตัวแปร ccv_UserCode_ID และ Color_Name ให้ตรงกับ PHP
        const payloadCode = {
            ccv_UserCode_ID: lastccv_UserCodeID, // ต้องตรงกับ $request->input('ccv_UserCode_ID')
            User_ID: realUserID,
            Color_Name: currentSelectedColorName || "Default",
            Texture_Name: currentSelectedTexture || "None"
        };

        const reqCode = await fetch(`${appURL}/api/save-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payloadCode)
        });

        if (!reqCode.ok) {
             const errCode = await reqCode.json();
             throw new Error(errCode.error || "Save Code Failed");
        }

        return true;

    } catch (error) {
        console.error("❌ Link Error:", error);
        return false;
    }
}

// ==========================================
// 5. Entry Point & Listeners
// ==========================================

// ✅ สร้างฟังก์ชันสำหรับเล่นเสียงคำสั่ง
function playCommandSound() {
    const cmdSound = document.getElementById('commandSound');
    if (cmdSound) {
        cmdSound.currentTime = 0; // ให้เสียงกลับไปจุดเริ่มต้น เผื่อผู้เล่นกดปุ่มรัวๆ
        cmdSound.volume = 0.5;    // ปรับความดังได้ตามต้องการ (0.0 - 1.0)
        cmdSound.play().catch(e => console.error("เล่นเสียงคำสั่งไม่ได้:", e));
    }
}

// ✅ สร้างฟังก์ชันสำหรับเล่นเสียง Undo/Redo
function playUndoRedoSound() {
    const urSound = document.getElementById('undoRedoSound');
    if (urSound) {
        urSound.currentTime = 0; // ให้เสียงกลับไปเริ่มต้น เผื่อกดรัวๆ
        urSound.volume = 0.5;    // ปรับความดังได้ (0.0 - 1.0)
        urSound.play().catch(e => console.error("เล่นเสียง Undo/Redo ไม่ได้:", e));
    }
}

// ✅ อัปเดตปุ่มทิศทาง เพื่อแก้ไขกรอบการชนให้ครอบคลุมหน้าจอใหม่
if (btnForward) btnForward.addEventListener('click', () => {
    playCommandSound();
    recordGameStart();
    const angleInDegree = dot.angle % 360;
    const normalizedAngle = angleInDegree < 0 ? angleInDegree + 360 : angleInDegree;
    const moveDist = (normalizedAngle % 90 !== 0) ? gridSize * Math.sqrt(2) : gridSize;
    const rad = ((dot.angle - 90) * Math.PI) / 180;

    // คำนวณจุดต่อไปที่จะเดินไปถึง
    const nextX = dot.x + Math.round(Math.cos(rad) * moveDist);
    const nextY = dot.y + Math.round(Math.sin(rad) * moveDist);

    // ✅ แก้ไขเงื่อนไขกรอบการเดิน: ให้เดินได้เต็มพื้นที่ Canvas 0 ถึง Max Width/Height
    // โดยเผื่อระยะขอบไว้เล็กน้อย (buffer ประมาณ 10 px) กันจุดล้นออกนอกจอ
    const buffer = 10;
    if (nextX >= buffer && nextX <= canvas.width - buffer &&
        nextY >= buffer && nextY <= canvas.height - buffer) {

        dot.x = nextX;
        dot.y = nextY;
        saveState();
        draw();
    }
});

if (btnLeft) btnLeft.addEventListener('click', () => {
    playCommandSound(); // ✅ สั่งเล่นเสียงเมื่อกด moveLeft
    recordGameStart(); dot.angle -= 45; saveState(); draw();
});

if (btnRight) btnRight.addEventListener('click', () => {
    playCommandSound(); // ✅ สั่งเล่นเสียงเมื่อกด moveRight
    recordGameStart(); dot.angle += 45; saveState(); draw();
});

// อัปเดตการทำงานของปุ่ม Undo และใส่เสียง (ลบอันที่ซ้ำกันทิ้งไป)
if (btnUndo) {
    btnUndo.addEventListener('click', () => {
        if (pathHistory.length > 1) {
            playUndoRedoSound(); // เรียกเล่นเสียงเมื่อกด Undo และมีประวัติให้ย้อน
            redoStack.push(pathHistory.pop());
            dot = { ...pathHistory[pathHistory.length - 1] };
            draw();
        }
    });
}

// อัปเดตการทำงานของปุ่ม Redo และใส่เสียง (ลบอันที่ซ้ำกันทิ้งไป)
if (btnRedo) {
    btnRedo.addEventListener('click', () => {
        if (redoStack.length > 0) {
            playUndoRedoSound(); // เรียกเล่นเสียงเมื่อกด Redo และมีประวัติให้ทำซ้ำ
            const next = redoStack.pop();
            pathHistory.push(next);
            dot = { ...next };
            draw();
        }
    });
}

if (btnReset) {
    btnReset.addEventListener('click', () => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'ต้องการรีเซ็ตใหม่อีกครั้งไหม?',
                text: 'ภาพและโค้ดปัจจุบันจะถูกล้าง',
                showCancelButton: true,
                confirmButtonText: 'เริ่มใหม่',
                cancelButtonText: 'ยกเลิก',
                reverseButtons: true,
                buttonsStyling: false, // ปิด Style เดิม
                heightAuto: false, // ✅ สำคัญมาก! ป้องกันไม่ให้แบคกราวด์หน้าเกมพัง
                backdrop: 'rgba(0, 0, 0, 0.6)', // ✅ ทำให้พื้นหลังดำโปร่งแสง เห็นหน้าเกมลางๆ
                customClass: {
                    popup: 'my-swal-popup',
                    title: 'my-swal-title',
                    htmlContainer: 'my-swal-text',
                    actions: 'my-swal-actions',
                    confirmButton: 'my-swal-confirm',
                    cancelButton: 'my-swal-cancel'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const resetSound = document.getElementById('resetSound');
                    if (resetSound) {
                        resetSound.currentTime = 0;
                        resetSound.volume = 0.5;
                        resetSound.play().catch(e => console.log("Sound error"));
                    }
                    sessionStorage.removeItem('userPathHistory');
                    setupCanvas(startGridPos.x, startGridPos.y);
                }
            });
        }
    });
}

if (btnRun) btnRun.addEventListener('click', async () => {
    if (btnRun.disabled) return;

    // ✅ 2. สั่งให้เล่นเสียงทันทีที่กดปุ่ม RUN
    const btnSound = document.getElementById('buttonSound');
    if (btnSound) {
        btnSound.currentTime = 0;
        btnSound.volume = 0.4; // ปรับความดังตามชอบ
        btnSound.play().catch(e => console.log("Sound play error"));
    }

    const duration = calculateDuration();

    if (currentChallengeData) {
        sessionStorage.setItem('storedChallengeName', currentChallengeData.Challenge);
        sessionStorage.setItem('storedChallengeID', currentChallengeData.Challenge_ID);
    }

    const userCommands = Array.from(codeBox.querySelectorAll('.code-item')).map(item => item.innerText).join(', ');
    const cleanPath = getCleanPath();
    const userPoints = cleanPath.map(p => `(${p.x}, ${p.y})`).join(', ');

    sessionStorage.setItem('gameDuration', duration);
    sessionStorage.setItem('gameStartTimeString', gameStartTimeString);
    sessionStorage.setItem('rawccv_UserCode', userCommands);
    sessionStorage.setItem('rawUserPoint', userPoints);
    sessionStorage.setItem('ccv_UserCodeHtml', codeBox.innerHTML);
    sessionStorage.setItem('userPathHistory', JSON.stringify(pathHistory));

    await saveccv_UserCodeAndStoreId();

    if (currentChallengeData && currentChallengeData.Challenge_ID) {
        window.location.href = `${appURL}/result?id=${currentChallengeData.Challenge_ID}`;
    }
});

window.addEventListener('resize', () => { if (canvas) { setupCanvas(); draw(); } });

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('id');
    currentChallengeIdForCustom = challengeId;

    if (canvas) { setupCanvas(); draw(); loadChallengeData(challengeId || 1); }
    else if (document.getElementById('resultChallengeName')) {

        // ✅ 1. ดึงชื่อโจทย์มาแสดง
        const storedName = sessionStorage.getItem('storedChallengeName');
        const nameElement = document.getElementById('resultChallengeName');
        if (storedName && nameElement) {
            nameElement.innerText = storedName;
        }

        const sCodeHtml = sessionStorage.getItem('ccv_UserCodeHtml');
        if (sCodeHtml && boxCode) boxCode.innerHTML = sCodeHtml;

        const sPath = sessionStorage.getItem('userPathHistory');
        const playAnimation = () => {
            if (sPath && frameResult) {
                frameResult.innerHTML = '<canvas id="animationCanvas"></canvas>';
                const ac = document.getElementById('animationCanvas');
                const actx = ac.getContext('2d');
                ac.width = frameResult.clientWidth;
                ac.height = frameResult.clientHeight;
                const p = JSON.parse(sPath);

                // จัดกึ่งกลางภาพ
                if (p.length > 0) {
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    p.forEach(point => {
                        minX = Math.min(minX, point.x);
                        minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x);
                        maxY = Math.max(maxY, point.y);
                    });

                    const drawingCenterX = (minX + maxX) / 2;
                    const drawingCenterY = (minY + maxY) / 2;
                    const canvasCenterX = ac.width / 2;
                    const canvasCenterY = ac.height / 2;

                    const offsetX = canvasCenterX - drawingCenterX;
                    const offsetY = (canvasCenterY - drawingCenterY) + 40;

                    actx.translate(offsetX, offsetY);
                }

                let i = 0;
                const timer = setInterval(() => {
                    if (i >= p.length - 1) { clearInterval(timer); return; }
                    const s = p[i]; const e = p[i + 1];
                    actx.beginPath(); actx.strokeStyle = '#000'; actx.lineWidth = 4; actx.lineCap = 'round';
                    actx.moveTo(s.x, s.y); actx.lineTo(e.x, e.y); actx.stroke();
                    i++;
                }, 150);
            }
        };
        playAnimation();
        if (btnRestartAni) btnRestartAni.addEventListener('click', playAnimation);
    }

    if (btnRandom) {
        //initRandomPage();
        btnRandom.addEventListener('click', startRandomization);
    }

    // ==========================================================
    // ✅ Home Page Button Sounds
    // ==========================================================
    function playButtonSound() {
        const btnSound = document.getElementById('buttonSound');
        if (btnSound) {
            btnSound.currentTime = 0;
            btnSound.volume = 0.5;
            btnSound.play().catch(e => console.log("Playback blocked or file missing"));
        }
    }

    const btnHomePlay = document.querySelector('.bt-play');
    const btnHomeGallery = document.querySelector('.bt-gallery');
    const btnHomeTutorial = document.querySelector('.bt-tutorial');

    if (btnHomePlay) btnHomePlay.addEventListener('click', playButtonSound);
    if (btnHomeGallery) btnHomeGallery.addEventListener('click', playButtonSound);
    if (btnHomeTutorial) btnHomeTutorial.addEventListener('click', playButtonSound);

    // ==========================================================
    // ✅ ปุ่ม ถัดไป (Next) เพื่อไปหน้า Custom
    // ==========================================================
    const btnGoToCustom = document.getElementById('btnGoToCustom');
    if (btnGoToCustom) {
        btnGoToCustom.addEventListener('click', () => {
            playButtonSound();
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');
                if (currentId) {
                    window.location.href = `${appURL}/custom?id=${currentId}`;
                } else {
                    window.location.href = `${appURL}/custom`;
                }
            }, 150);
        });
    }

    // ==========================================================
    // ✅ ปุ่ม ย้อนกลับ ไปหน้า Main Game
    // ==========================================================
    const btnBackToMain = document.getElementById('btnBackToMain');
    if (btnBackToMain) {
        btnBackToMain.addEventListener('click', () => {
            playButtonSound();
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');
                if (currentId) {
                    window.location.href = `${appURL}/play?id=${currentId}`;
                } else {
                    window.history.back();
                }
            }, 150);
        });
    }

    // ==========================================================
    // ✅ ปุ่ม ย้อนกลับ ไปหน้า Result (ทำงานเฉพาะในหน้า Custom)
    // ==========================================================
    const btnBackToResult = document.getElementById('btnBackToResult');
    if (btnBackToResult) {
        btnBackToResult.addEventListener('click', () => {
            // เล่นเสียง
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) {
                btnSound.currentTime = 0;
                btnSound.volume = 0.5;
                btnSound.play().catch(e => console.log("Sound play error"));
            }

            // หน่วงเวลาเล็กน้อยแล้วพากลับไปหน้าผลลัพธ์
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');

                if (currentId) {
                    window.location.href = `${appURL}/result?id=${currentId}`;
                } else {
                    window.history.back();
                }
            }, 150);
        });
    }

    // ==========================================================
    // ✅ Custom Page Logic
    // ==========================================================
    const customResultImg = document.getElementById('customResultImg');
    const boxColorContainer = document.querySelector('.box-color');
    const userNameInput = document.getElementById('userNameInput');

    if (userNameInput) {
        userNameInput.addEventListener('input', validateForm);
    }

    if (customResultImg && boxColorContainer) {
        if (currentChallengeIdForCustom) {
            fetch(`${appURL}/api/challenge/${currentChallengeIdForCustom}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        sessionStorage.setItem('storedChallengeName', data.Challenge);
                        sessionStorage.setItem('storedChallengeID', data.Challenge_ID);
                        if (data.Result_Image) {
                            currentResultImageName = data.Result_Image;
                            customResultImg.src = `${appURL}/img/result-image/${data.Result_Image}`;
                            customResultImg.onload = () => { customResultImg.style.opacity = 1; };
                        }
                    }
                })
                .catch(e => console.error("Error loading default image:", e));
        }

        fetch(`${appURL}/api/colors`)
            .then(res => res.json())
            .then(colors => {
                boxColorContainer.innerHTML = '';
                if (colors.length > 0) {
                    colors.forEach((color) => {
                        const colorCode = color.Color_Code || color.color_code;
                        const colorName = color.Color_Name || color.color_name;
                        const colorId = color.Color_ID || color.color_id;

                        if(!colorName || colorName.toLowerCase() === 'none') return;

                        const div = document.createElement('div');
                        div.className = 'circle-color-item';
                        div.style.backgroundColor = colorCode;
                        div.dataset.colorId = colorId;

                        div.onclick = function() {
                            document.querySelectorAll('.circle-color-item').forEach(el => el.classList.remove('active'));
                            this.classList.add('active');

                            currentSelectedColorId = colorId;
                            currentSelectedColorName = colorName;

                            if (currentSelectedTexture === null) {
                                currentSelectedTexture = 'None';
                                const noneBtn = document.querySelector('.texture-btn.box-texture-none');
                                if(noneBtn) noneBtn.classList.add('active');
                            }
                            updateCustomImage();
                            validateForm();
                        };
                        boxColorContainer.appendChild(div);
                    });
                }
            });
    }

    // ==========================================================
    // ✅ ปุ่ม Confirm บันทึกภาพ
    // ==========================================================
    if (btnConfirm) {
        validateForm();

        btnConfirm.addEventListener('click', async () => {
            playButtonSound();

            const success = await saveFinalData();

            if (success) {
                const mainImage = document.getElementById('customResultImg');
                const modalImage = document.getElementById('finalResultImage');
                const qrImage = document.getElementById('qrResult');

                const userNameInput = document.getElementById('userNameInput');
                const successNameDisplay = document.getElementById('successNameDisplay');

                let playerName = "";
                if (userNameInput) {
                    playerName = userNameInput.value.trim();
                }

                if (successNameDisplay) {
                    const finalName = playerName ? playerName : "สำเร็จแล้ว!";
                    successNameDisplay.innerText = finalName;

                    // ✅ ตรวจสอบภาษาและสลับฟอนต์ใน Popup ของหน้า Custom
                    const isThai = /[\u0E00-\u0E7F]/.test(finalName);
                    if (isThai) {
                        // ถ้าเป็นภาษาไทย ใช้ Sriracha
                        successNameDisplay.style.setProperty('font-family', "'Sriracha', cursive", 'important');
                        // ปรับขนาดเล็กลงนิดนึงให้พอดีกับฟอนต์ไทย
                        successNameDisplay.style.setProperty('font-size', '2.5rem', 'important');
                    } else {
                        // ถ้าเป็นภาษาอังกฤษล้วน ใช้ Caveat
                        successNameDisplay.style.setProperty('font-family', "'Caveat', cursive", 'important');
                        // ปรับขนาดให้ใหญ่ขึ้นเพราะฟอนต์ลายมืออังกฤษจะดูเล็ก
                        successNameDisplay.style.setProperty('font-size', '3.5rem', 'important');
                    }
                }

                if (mainImage && modalImage) {
                    modalImage.src = mainImage.src;
                    if (qrImage) {
                        const imageUrl = mainImage.src;
                        const imageName = imageUrl.split('/').pop();

                        const rawCode = sessionStorage.getItem('rawccv_UserCode') || "";
                        const fCount = (rawCode.match(/forward/g) || []).length;
                        const lCount = (rawCode.match(/moveLeft/g) || []).length;
                        const rCount = (rawCode.match(/moveRight/g) || []).length;

                        const timePlayed = sessionStorage.getItem('gameDuration') || "0.0";

                        const sharePageUrl = `${appURL}/share?img=${imageName}&f=${fCount}&l=${lCount}&r=${rCount}&t=${timePlayed}&n=${encodeURIComponent(playerName)}`;

                        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(sharePageUrl)}`;
                        qrImage.src = qrApiUrl;
                    }
                }

                if (customModal) {
                    const popupSound = document.getElementById('popupSound');
                    if (popupSound) {
                        popupSound.currentTime = 0;
                        popupSound.volume = 0.4;
                        popupSound.play().catch(e => console.error("เล่นเสียง Popup ไม่ได้:", e));
                    }
                    customModal.style.display = "flex";
                }

            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
            }
        });
    }

    // ✅ ปุ่ม คลังภาพวาด ใน Popup
    const btnGalleryGreen = document.querySelector('.btn-gallery-green');
    if (btnGalleryGreen) {
        btnGalleryGreen.addEventListener('click', (e) => {
            playButtonSound();
            e.preventDefault();
            const targetUrl = btnGalleryGreen.getAttribute('href');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 150);
        });
    }

    const btnCloseCustom = document.querySelector('.close-modal');
    if (btnCloseCustom && customModal) btnCloseCustom.addEventListener('click', () => customModal.style.display = "none");

    // ==========================================
    // Randomization Functions
    // ==========================================

    // เพิ่มตัวแปรสำหรับจำ ID โจทย์ที่เพิ่งสุ่มได้รอบล่าสุด
    let previousFinalChallengeId = null;

    async function initRandomPage() {
        if (!btnRandom) return;
        try {
            const r = await fetch(`${appURL}/api/all-challenges`);
            allChallenges = await r.json();
            updateQuotaDisplay();
        } catch (e) {}
    }

    function updateQuotaDisplay() {
        if (numRandomDisplay) numRandomDisplay.innerText = `(${randomQuota})`;
        if (randomQuota <= 0 && btnRandom) {
            btnRandom.disabled = true;
            btnRandom.style.cursor = "not-allowed";
            if (btnRandomBox) btnRandomBox.classList.add('btn-disabled');
        }
    }

    async function startRandomization() {
        await initRandomPage();
        if (allChallenges.length === 0 || randomQuota <= 0) return;

        playButtonSound();

        const randomSound = document.getElementById('randomSound');
        if (randomSound) {
            randomSound.currentTime = 0;
            randomSound.volume = 1;
            randomSound.play().catch(e => console.error("เล่นเสียงไม่ได้:", e));
        }

        randomQuota--;
        updateQuotaDisplay();
        if(btnRandom) btnRandom.disabled = true;

        let c = 0;
        if (textRandom) textRandom.classList.add('randomizing');

        // ตัวแปรกันไม่ให้ชื่อซ้ำติดกันตอนแอนิเมชันกำลังวิ่ง (เพื่อความสวยงาม)
        let lastSpinId = null;

        const i = setInterval(() => {
            // กรองไม่ให้แอนิเมชันกระตุกโชว์ชื่อเดิมซ้ำติดกัน
            let availableForSpin = allChallenges.filter(ch => ch.Challenge_ID !== lastSpinId);
            if (availableForSpin.length === 0) availableForSpin = allChallenges;

            const idx = Math.floor(Math.random() * availableForSpin.length);
            lastSpinId = availableForSpin[idx].Challenge_ID;

            if (textRandom) textRandom.innerText = availableForSpin[idx].Challenge;

            if (++c >= 20) {
                clearInterval(i);
                finishRandomization();
            }
        }, 80);
    }

    function finishRandomization() {
        // ✅ 2. กรองเอาโจทย์ที่ "สุ่มได้รอบที่แล้ว" ออกจากกอง
        let availableChallenges = allChallenges.filter(ch => ch.Challenge_ID !== previousFinalChallengeId);

        // (เผื่อกรณีระบบมีโจทย์แค่ 1 ข้อ ให้ดึงกลับมาทั้งหมด ไม่งั้นพัง)
        if (availableChallenges.length === 0) {
            availableChallenges = allChallenges;
        }

        // ✅ 3. สุ่มจากโจทย์ที่เหลืออยู่ (รับประกันว่าไม่ซ้ำเดิม)
        const idx = Math.floor(Math.random() * availableChallenges.length);
        const sel = availableChallenges[idx];

        // ✅ 4. จำ ID ของโจทย์นี้ไว้ใช้กรองในรอบต่อไป
        previousFinalChallengeId = sel.Challenge_ID;

        if (textRandom) {
            textRandom.innerText = sel.Challenge;
            textRandom.classList.remove('randomizing');
        }
        if (randomQuota > 0 && btnRandom) btnRandom.disabled = false;

        setTimeout(() => {
            const randomSound = document.getElementById('randomSound');
            if (randomSound) {
                randomSound.pause();
            }
            showModal(sel);
        }, 500);
    }

    function showModal(d) {
        if (!modal) return;

        const popupSound = document.getElementById('popupSound');
        if (popupSound) {
            popupSound.currentTime = 0;
            popupSound.volume = 0.4;
            popupSound.play().catch(e => console.error("เล่นเสียง Popup ไม่ได้:", e));
        }

        const n = document.getElementById("modalChallengeName");
        const i = document.getElementById("modalOriginalImage");
        const g = document.getElementById("btnGoToGame");
        const c = modal.querySelector('.close-modal');

        if (n) n.innerText = d.Challenge;
        if (i && d.Original_Image) {
            i.src = `${appURL}/img/original-image/${d.Original_Image}`;
            i.style.display = 'block';
        }
        if (c) c.style.display = (randomQuota <= 0) ? 'none' : 'flex';

        if (g) {
            g.onclick = () => {
                playButtonSound();
                setTimeout(() => {
                    window.location.href = `${appURL}/play?id=${d.Challenge_ID}`;
                }, 150);
            };
        }

        modal.style.display = "flex";
    }

    if (document.querySelector(".close-modal")) document.querySelector(".close-modal").addEventListener('click', () => { if (modal) modal.style.display = "none"; });
});

// ==========================================
// 6. Tutorial Slider Logic
// ==========================================
let slideIndex = 1;

if (document.getElementById('tutorialModal')) {
    showSlides(slideIndex);

    const modalTutorial = document.getElementById('tutorialModal');

    document.addEventListener('click', (e) => {
        if (e.target.closest('.close-tutorial')) {
            modalTutorial.style.display = "none";
        }
        if (e.target.closest('#btnStartGame')) {
            modalTutorial.style.display = "none";
        }
    });
}

window.changeSlide = function(n) {
    showSlides(slideIndex += n);
};

window.currentSlide = function(n) {
    showSlides(slideIndex = n);
};

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("tutorial-slide");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove('active');
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    slides[slideIndex-1].classList.add('active');

    if(dots.length > 0) {
        dots[slideIndex-1].className += " active";
    }
}

// ==========================================
// 🚨 Keyboard Shortcuts (Emergency Restart & Auto-Complete)
// ==========================================
document.addEventListener('keydown', function(event) {

    // ----------------------------------------------------
    // 1. Emergency Restart (ปุ่มฉุกเฉินกลับหน้าแรก): "Shift + ESC"
    // ----------------------------------------------------
    if (event.shiftKey && event.key === 'Escape') {
        event.preventDefault();
        console.log("🚨 Initiating Emergency Restart... Going to Home!");

        // ล้างข้อมูลที่ผู้เล่นคนปัจจุบันทำค้างไว้ทั้งหมด
        sessionStorage.clear();

        // เด้งกลับไปหน้า Home
        if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
            window.location.href = '/';
        } else {
            window.location.href = appURL;
        }
    }

    // ----------------------------------------------------
    // 2. Auto-Complete (สูตรโกงวาดเสร็จทันที): "Shift + F" (หรือ 'ด' แป้นไทย)
    // ----------------------------------------------------
    if (event.shiftKey && (event.key === 'f' || event.key === 'F' || event.key === 'ด')) {
        event.preventDefault();
        console.log("🛠️ Auto-Complete Activated!");

        // เช็คว่ามีข้อมูลเฉลยไหม
        if (!validPaths || validPaths.length === 0) {
            console.log("No valid paths to solve.");
            return;
        }

        // 1. เริ่มนับเวลา (เผื่อยังไม่ได้กดปุ่มทิศทางเลย)
        recordGameStart();

        // 2. รีเซ็ตตัวเล่นให้กลับไปจุดเริ่มต้นของกระดาน
        dot = { x: gridOffset.x, y: gridOffset.y, angle: 0 };
        pathHistory = [{ x: dot.x, y: dot.y, angle: dot.angle }];
        redoStack = [];

        // 3. ดึงเส้นทางเฉลย (Path เป้าหมาย)
        const targetPath = validPaths[0];

        // 4. วนลูปเดินตามพิกัดของเฉลย
        for (let i = 1; i < targetPath.length; i++) {
            const prevNode = targetPath[i - 1];
            const currNode = targetPath[i];

            let dx = currNode.x - prevNode.x;
            let dy = currNode.y - prevNode.y;

            // คำนวณองศาที่ต้องหันหน้าไปหาจุดต่อไป
            let targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (targetAngle < 0) targetAngle += 360;

            // จังหวะที่ 1: ถ้าต้องหันหน้า (องศาเปลี่ยน) ให้บันทึกสถานะการหมุน
            if (targetAngle !== dot.angle) {
                dot.angle = targetAngle;
                pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle });
            }

            // จังหวะที่ 2: เดินไปข้างหน้าตามพิกัดบนหน้าจอจริง
            dot.x = gridOffset.x + (currNode.x * gridSize);
            dot.y = gridOffset.y + (currNode.y * gridSize);
            pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle });
        }

        // 5. สั่งอัปเดตหน้าจอ ตรวจสอบความถูกต้อง และเล่นเสียงสำเร็จ
        draw();
    }
});
