// ==========================================
// codeCanvas.js (Final Fix: Linked ID & Color Correct + Random Sound)
// ==========================================

const appURL = "https://funcslash.com/ia21/ccv";

// --- Global Selectors ---
const canvas = document.getElementById('gameCanvas');
let ctx = null;
if (canvas) ctx = canvas.getContext('2d');

// Buttons & UI
const btnForward = document.querySelector('.forward');
const btnLeft = document.querySelector('.moveleft');
const btnRight = document.querySelector('.moveright');
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
const gridSize = 25;
const dotSize = 2;
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

// ✅ เพิ่มตัวแปรนี้เข้าไป เพื่อกันไม่ให้เสียงดังรัวๆ ซ้ำซ้อน
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
                const startPointStr = dataTemplate[0].Code_Start;
                const startCoordsArr = parseCoordinates(startPointStr);
                let startObj = (startCoordsArr.length > 0) ? startCoordsArr[0] : {x: 5, y: 19};

                validPaths = [];
                dataTemplate.forEach(row => {
                    if (row.Code_Point) {
                        const path = parseCoordinates(row.Code_Point);
                        if (path.length > 0 && (path[0].x !== startObj.x || path[0].y !== startObj.y)) {
                            path.unshift(startObj);
                        }
                        validPaths.push(path);
                    }
                });
                startGridPos = { x: startObj.x, y: startObj.y };
                setupCanvas(startObj.x, startObj.y);
            } else {
                setupCanvas(5, 19);
                validPaths = [];
            }
        }
    } catch (error) { console.error(error); setupCanvas(5, 19); }
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

    const availableWidth = canvas.width - (minPadding * 2);
    const availableHeight = canvas.height - (minPadding * 2);
    const cols = Math.floor(availableWidth / gridSize);
    const rows = Math.floor(availableHeight / gridSize);

    gridOffset.x = (canvas.width - (cols * gridSize)) / 2;
    gridOffset.y = (canvas.height - (rows * gridSize)) / 2;

    const startX = gridOffset.x + (gridX * gridSize);
    const startY = gridOffset.y + (gridY * gridSize);

    dot = { x: startX, y: startY, angle: 0 };
    pathHistory = [{ x: dot.x, y: dot.y, angle: dot.angle }];
    redoStack = [];
    if (codeBox) codeBox.innerHTML = '';

    isGameStarted = false;
    gameStartTimeObj = null;

    updateRunButtonState(false);
    draw();
}

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. วาดจุด Grid (พื้นหลัง)
    ctx.fillStyle = '#fddfb3ff';
    for (let x = gridOffset.x; x <= canvas.width - gridOffset.x + 1; x += gridSize) {
        for (let y = gridOffset.y; y <= canvas.height - gridOffset.y + 1; y += gridSize) {
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
    const fullPath = pathHistory.map(p => ({
        x: Math.round((p.x - gridOffset.x) / gridSize),
        y: Math.round((p.y - gridOffset.y) / gridSize)
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

function validatePathWithDB() {
    if (!btnRun) return;
    const userGridPath = getCleanPath();
    if (!validPaths || validPaths.length === 0) {
        updateRunButtonState(false);
        previousCorrectState = false; // รีเซ็ตสถานะเมื่อไม่มี path
        return;
    }

    // ตรวจสอบว่าพิกัดตรงกัน 100% ไหม
    const isCorrect = validPaths.some((targetPath, idx) => {
        if (userGridPath.length !== targetPath.length) return false;
        for (let i = 0; i < targetPath.length; i++) {
            if (userGridPath[i].x !== targetPath[i].x || userGridPath[i].y !== targetPath[i].y) return false;
        }
        return true;
    });

    // ✅ เงื่อนไขการเล่นเสียง: ถ้า "วาดถูก" และ "ก่อนหน้านี้ยังไม่ได้วาดถูก" (กันเสียงดังรัวๆ)
    if (isCorrect && !previousCorrectState) {
        const successSound = document.getElementById('successSound');
        if (successSound) {
            successSound.currentTime = 0;
            successSound.volume = 0.2; // ปรับความดังได้ (0.0 - 1.0)
            successSound.play().catch(e => console.error("เล่นเสียงไม่ได้:", e));
        }
    }

    // บันทึกสถานะปัจจุบันไว้
    previousCorrectState = isCorrect;

    updateRunButtonState(isCorrect);
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

function updateCodeBox() {
    if (!codeBox) return;
    codeBox.innerHTML = '';
    let groupedCommands = [];
    for (let i = 1; i < pathHistory.length; i++) {
        const current = pathHistory[i], prev = pathHistory[i - 1];
        let type = "", className = "", isRotation = false;
        if (current.angle !== prev.angle) {
            isRotation = true;
            if (current.angle < prev.angle) { type = "moveLeft"; className = "item-moveleft"; }
            else { type = "moveRight"; className = "item-moveright"; }
        } else { type = "forward"; className = "item-forward"; }
        let lastCommand = groupedCommands[groupedCommands.length - 1];
        if (lastCommand && lastCommand.type === type) {
            if (isRotation) {
                let nextAngle = lastCommand.value + 45; if (nextAngle > 360) nextAngle = 45; lastCommand.value = nextAngle;
            } else { lastCommand.value += 1; }
        } else { groupedCommands.push({ type, className, value: isRotation ? 45 : 1, isRotation }); }
    }
    groupedCommands.forEach(cmd => {
        const span = document.createElement('span'); span.className = `code-item ${cmd.className}`;
        span.innerText = cmd.isRotation ? `${cmd.type}(${cmd.value}°)` : `${cmd.type}(${cmd.value})`;
        codeBox.appendChild(span);
    });
    codeBox.scrollLeft = codeBox.scrollWidth;
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

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    currentSelectedTexture = formattedName;

    if (currentSelectedColorId === null) {
        currentSelectedColorId = 1;
        currentSelectedColorName = "Yellow";
        const yellowBtn = document.querySelector('.circle-color-item[data-color-id="1"]');
        if(yellowBtn) yellowBtn.classList.add('active');
    }

    updateCustomImage();
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

if (btnForward) btnForward.addEventListener('click', () => {
    playCommandSound(); // ✅ สั่งเล่นเสียงเมื่อกด forward
    recordGameStart();
    const angleInDegree = dot.angle % 360;
    const normalizedAngle = angleInDegree < 0 ? angleInDegree + 360 : angleInDegree;
    const moveDist = (normalizedAngle % 90 !== 0) ? gridSize * Math.sqrt(2) : gridSize;
    const rad = ((dot.angle - 90) * Math.PI) / 180;
    const nextX = dot.x + Math.round(Math.cos(rad) * moveDist);
    const nextY = dot.y + Math.round(Math.sin(rad) * moveDist);
    if (nextX >= gridOffset.x - 1 && nextX <= canvas.width - gridOffset.x + 1 && nextY >= gridOffset.y - 1 && nextY <= canvas.height - gridOffset.y + 1) {
        dot.x = nextX; dot.y = nextY; saveState(); draw();
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
                confirmButtonColor: '#2d93ff',
                cancelButtonColor: '#fff',
                confirmButtonText: 'เริ่มใหม่',
                cancelButtonText: 'ยกเลิก',
                reverseButtons: true,
                heightAuto: false,
                scrollbarPadding: false,
                customClass: {
                    popup: 'my-swal-popup',
                    title: 'my-swal-title',
                    htmlContainer: 'my-swal-text',
                    confirmButton: 'my-swal-confirm',
                    cancelButton: 'my-swal-cancel'
                }
            }).then((result) => {
                if (result.isConfirmed) {

                    // ✅ 2. สั่งเล่นเสียงเมื่อกดยืนยันการรีเซ็ต
                    const resetSound = document.getElementById('resetSound');
                    if (resetSound) {
                        resetSound.currentTime = 0;
                        resetSound.volume = 0.5;
                        resetSound.play().catch(e => console.log("Sound play error"));
                    }

                    setupCanvas(startGridPos.x, startGridPos.y);
                }
            });
        } else {
            if(confirm("ต้องการรีเซ็ตใหม่อีกครั้งไหม?")) {
                // ✅ 2. สั่งเล่นเสียงกรณีใช้ Confirm ปกติ
                const resetSound = document.getElementById('resetSound');
                if (resetSound) {
                    resetSound.currentTime = 0;
                    resetSound.play();
            }
                setupCanvas(startGridPos.x, startGridPos.y);
            }
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

        // ✅ 1. เพิ่มส่วนนี้: ดึงชื่อโจทย์มาแสดง
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
        initRandomPage();
        btnRandom.addEventListener('click', startRandomization);
    }
    // ==========================================================
    // ✅ วางโค้ด Home Page Button Sounds ตรงนี้ครับ
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

    if (btnHomePlay) {
        btnHomePlay.addEventListener('click', () => {
            playButtonSound();
        });
    }

    if (btnHomeGallery) {
        btnHomeGallery.addEventListener('click', () => {
            playButtonSound();
        });
    }

    if (btnHomeTutorial) {
        btnHomeTutorial.addEventListener('click', () => {
            playButtonSound();
        });
    }
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
                        // ✅ แก้ไขตรงนี้: รองรับทั้งตัวพิมพ์เล็กและใหญ่
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
                            currentSelectedColorName = colorName; // ✅ เก็บค่าสีที่ถูกต้อง

                            console.log("Selected Color:", currentSelectedColorName);

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

    const btnNext = document.querySelector('.bt-next');
if (btnNext) {
    btnNext.addEventListener('click', () => {

        // 1. เล่นเสียงปุ่ม
        const btnSound = document.getElementById('buttonSound');
        if (btnSound) {
            btnSound.currentTime = 0;
            btnSound.volume = 0.4;
            btnSound.play().catch(e => console.log("Sound play error"));
        }

        // 2. หน่วงเวลาเล็กน้อย (150ms) เพื่อให้เสียงดังก่อนเปลี่ยนหน้า
        setTimeout(() => {
            window.location.href = challengeId ? `${appURL}/custom?id=${challengeId}` : `${appURL}/custom`;
        }, 150);
    });
}
    // ค้นหาและวางทับส่วน if (btnConfirm) เดิมด้วยโค้ดชุดนี้ครับ
    if (btnConfirm) {
        validateForm();

        btnConfirm.addEventListener('click', async () => {

            // 1. เล่นเสียงปุ่ม (button-sound) ทันทีที่กดคลิก
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) {
                btnSound.currentTime = 0;
                btnSound.volume = 0.5;
                btnSound.play().catch(e => console.log("Sound play error"));
            }

            const success = await saveFinalData();

            if (success) {
                const mainImage = document.getElementById('customResultImg');
                const modalImage = document.getElementById('finalResultImage');
                const qrImage = document.getElementById('qrResult');

                if (mainImage && modalImage) {
                    modalImage.src = mainImage.src;
                    if (qrImage) {
                        const imageUrl = mainImage.src;
                        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(imageUrl)}`;
                        qrImage.src = qrApiUrl;
                    }
                }

                // 2. เมื่อบันทึกสำเร็จ -> เล่นเสียง Popup และแสดงหน้าต่าง
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

    // ✅ เพิ่มเสียงปุ่มให้ "คลังภาพวาด" (ปุ่มสีเขียวใต้ Popup)
    const btnGalleryGreen = document.querySelector('.btn-gallery-green');
    if (btnGalleryGreen) {
        btnGalleryGreen.addEventListener('click', (e) => {
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) {
                btnSound.currentTime = 0;
                btnSound.play();
            }

            // หน่วงเวลาเล็กน้อยเพื่อให้ได้ยินเสียงก่อนเปลี่ยนหน้า
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
    // Randomization Functions (with Sound Effects)
    // ==========================================
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

// ฟังก์ชันตอนเริ่มกดปุ่มสุ่ม
    function startRandomization() {
        if (allChallenges.length === 0 || randomQuota <= 0) return;

        // ✅ เล่นเสียงปุ่มทันทีที่คลิกสุ่ม
        const btnSound = document.getElementById('buttonSound');
        if (btnSound) {
            btnSound.currentTime = 0;
            btnSound.play().catch(e => console.log("Sound error"));
        }

        // ✅ 1. ดึงไฟล์เสียงมา สั่งให้เริ่มที่ 0 และกดเล่นทันที
        const randomSound = document.getElementById('randomSound');
        if (randomSound) {
            randomSound.currentTime = 0; // ทำให้กดกี่ครั้งก็เริ่มเล่นจากวินาทีที่ 0 เสมอ
            randomSound.volume = 1;
            randomSound.play().catch(e => console.error("เล่นเสียงไม่ได้:", e));
        }

        randomQuota--;
        updateQuotaDisplay();
        if(btnRandom) btnRandom.disabled = true;

        let c = 0;
        if (textRandom) textRandom.classList.add('randomizing');

        const i = setInterval(() => {
            const idx = Math.floor(Math.random() * allChallenges.length);
            if (textRandom) textRandom.innerText = allChallenges[idx].Challenge;
            if (++c >= 20) {
                clearInterval(i);
                finishRandomization();
            }
        }, 80);
    }

    // ฟังก์ชันตอนที่สุ่มจนได้คำตอบแล้ว
    function finishRandomization() {
        const idx = Math.floor(Math.random() * allChallenges.length);
        const sel = allChallenges[idx];

        if (textRandom) {
            textRandom.innerText = sel.Challenge;
            textRandom.classList.remove('randomizing');
        }
        if (randomQuota > 0 && btnRandom) btnRandom.disabled = false;

        setTimeout(() => {
            // ✅ 2. สั่งหยุดเสียงทันทีที่กำลังจะแสดง Popup
            const randomSound = document.getElementById('randomSound');
            if (randomSound) {
                randomSound.pause(); // สั่งหยุด
            }

            showModal(sel);
        }, 500);
    }

function showModal(d) {
        if (!modal) return;

        // 1. เล่นเสียง Popup ทันทีที่หน้าต่างเด้ง
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

        // 2. เพิ่มเสียงปุ่ม (button-sound) เมื่อกดปุ่ม "เริ่มวาดเลย!" ก่อนเปลี่ยนหน้า
        if (g) {
            g.onclick = () => {
                const btnSound = document.getElementById('buttonSound');
                if (btnSound) {
                    btnSound.currentTime = 0;
                    btnSound.play();
                }

                // รอให้เสียงดังนิดนึงแล้วค่อยเปลี่ยนหน้า
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
