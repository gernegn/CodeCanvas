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

// Random Page Elements
const btnRandom = document.querySelector('.bt-random');
const btnRandomBox = document.querySelector('.btn-random-box');
const numRandomDisplay = document.querySelector('.num-random');

const loadingOverlay = document.getElementById('loadingOverlay');
const textLoadingSub = document.querySelector('.text-loading-sub');
const resultContainer = document.getElementById('resultContainer');
const randomResultText = document.getElementById('randomResultText');
const randomResultImage = document.getElementById('randomResultImage');

const btnStartGameBox = document.getElementById('btnStartGameBox');
const btnStartGameAction = document.getElementById('btnStartGameAction');
const btnRandomAction = document.getElementById('btnRandomAction');
const customModal = document.getElementById('customSuccessModal');

// --- Game Variables ---
const gridSize = window.innerWidth >= 1920 ? 20 : 25;
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

// --- Timing & State Variables ---
let isGameStarted = false;
let gameStartTimeObj = null;
let gameStartTimeString = "";
let cheerTimer = null;
let previousCorrectState = false;

// --- Custom Page Variables ---
let currentSelectedColorId = null;
let currentSelectedColorName = 'Default';
let currentSelectedTexture = null;
window.currentChallengeIdForCustom = null; // ✅ ใช้แบบ Global
let currentResultImageName = "";


// ==========================================
// 🎓 Interactive Tutorial System
// ==========================================
let isTutorialMode = false;
let tutorialStep = 0;
const tutorialOverlay = document.getElementById('tutorialDarkOverlay');
const tutorialBubble = document.getElementById('tutorialBubble');
const tutorialText = document.getElementById('tutorialText');
const btnSkipTutorial = document.getElementById('btnSkipTutorial');

const tutorialSteps = [
    { target: btnForward, text: "กดปุ่มนี้ 1 ครั้ง เพื่อเริ่มลากเส้นตรง", action: 'forward' },
    { target: btnRight, text: "ยอดเยี่ยม! กดปุ่มนี้เพื่อหันขวา 90 องศา", action: 'right' },
    { target: btnForward, text: "กดเดินหน้าอีกครั้ง เพื่อลากเส้นต่อ", action: 'forward' },
    { target: null, text: "ลองวาดสี่เหลี่ยมให้ครบ 100% ดูสิ!", action: 'freeplay' },
    { target: btnRun ? btnRun.closest('.bt-run-container') : null, text: "เก่งมาก! กดปุ่ม RUN เพื่อตรวจคำตอบเลย", action: 'run' }
];

function initTutorial() {
    isTutorialMode = true;
    tutorialStep = 0;

    if(challengeTitle) challengeTitle.innerText = "โหมดฝึกสอน: วาดสี่เหลี่ยม";
    if(frameImg) {
        frameImg.style.backgroundImage = `url('${appURL}/img/example-image/ex-tutorial.png')`;
        frameImg.style.backgroundSize = 'contain';
        frameImg.style.backgroundRepeat = 'no-repeat';
        frameImg.style.backgroundPosition = 'center';
    }

    validPaths = [[ {x:0, y:0}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0}, {x:0, y:0} ]];

    setupCanvas(0, 0);

    if(tutorialOverlay) tutorialOverlay.style.display = 'block';
    if(tutorialBubble) tutorialBubble.style.display = 'block';
    if(btnSkipTutorial) btnSkipTutorial.style.display = 'flex';

    showTutorialStep();
}

function showTutorialStep() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

    if(tutorialStep >= tutorialSteps.length) return;
    const step = tutorialSteps[tutorialStep];

    if(tutorialText) tutorialText.innerHTML = step.text;

    if (step.target) {
        step.target.classList.add('tutorial-highlight');
        const rect = step.target.getBoundingClientRect();
        tutorialBubble.style.top = `${rect.top - 80}px`;
        tutorialBubble.style.left = `${rect.left + (rect.width / 2)}px`;
    } else {
        const canvasRect = canvas.getBoundingClientRect();
        tutorialBubble.style.top = `${canvasRect.top + 50}px`;
        tutorialBubble.style.left = `${canvasRect.left + (canvasRect.width / 2)}px`;
    }
}

function advanceTutorial() {
    tutorialStep++;
    showTutorialStep();
}

function endTutorialAndStartGame() {
    isTutorialMode = false;
    if(tutorialOverlay) tutorialOverlay.style.display = 'none';
    if(tutorialBubble) tutorialBubble.style.display = 'none';
    if(btnSkipTutorial) btnSkipTutorial.style.display = 'none';
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

    sessionStorage.setItem('tutorialDone', 'true');

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'จบการฝึกสอน!',
            text: 'คุณพร้อมลุยของจริงแล้ว เริ่มเกมกันเลย!',
            confirmButtonText: 'ลุยเลย!',
            buttonsStyling: false,
            heightAuto: false,
            backdrop: 'rgba(0, 0, 0, 0.6)',
            customClass: {
                popup: 'my-swal-popup', title: 'my-swal-title', htmlContainer: 'my-swal-text',
                actions: 'my-swal-actions', confirmButton: 'my-swal-confirm'
            }
        }).then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            let challengeId = urlParams.get('id') || sessionStorage.getItem('storedChallengeID') || 1;
            loadChallengeData(challengeId);
        });
    }
}

if (btnSkipTutorial) {
    btnSkipTutorial.addEventListener('click', endTutorialAndStartGame);
}

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
            if (challengeTitle && !isTutorialMode) challengeTitle.innerText = dataChallenge.Challenge;

            if (frameImg && dataChallenge.Example_Image && !isTutorialMode) {
                frameImg.style.backgroundImage = `url('${appURL}/img/example-image/${dataChallenge.Example_Image}')`;
                frameImg.style.backgroundSize = 'contain';
                frameImg.style.backgroundRepeat = 'no-repeat';
                frameImg.style.backgroundPosition = 'center';
            }

            if (dataTemplate && dataTemplate.length > 0 && !isTutorialMode) {
                validPaths = [];
                let firstPathStart = null;
                dataTemplate.forEach(row => {
                    if (row.Code_Point) {
                        const path = parseCoordinates(row.Code_Point);
                        if (path.length > 0) {
                            if (!firstPathStart) firstPathStart = path[0];
                            const relativePath = path.map(p => ({
                                x: p.x - firstPathStart.x,
                                y: p.y - firstPathStart.y
                            }));
                            validPaths.push(relativePath);
                        }
                    }
                });
                setupCanvas(0, 0);
            } else if (!isTutorialMode) {
                setupCanvas(0, 0);
                validPaths = [];
            }

            const savedId = sessionStorage.getItem('storedChallengeID');
            const isPlayingNew = window.location.href.includes('play');

            if (savedId && savedId == id && !isPlayingNew && !isTutorialMode) {
                const savedPath = sessionStorage.getItem('userPathHistory');
                if (savedPath) {
                    pathHistory = JSON.parse(savedPath);
                    if (pathHistory && pathHistory.length > 0) {
                        dot = { ...pathHistory[pathHistory.length - 1] };
                        previousCorrectState = true;
                        draw();
                    }
                }
            } else if (!isTutorialMode) {
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

    let drawingCenterX = gridX;
    let drawingCenterY = gridY;

    if (validPaths && validPaths.length > 0) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        validPaths.forEach(path => {
            path.forEach(p => {
                minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
            });
        });
        drawingCenterX = (minX + maxX) / 2;
        drawingCenterY = (minY + maxY) / 2;
    }

    gridOffset.x = (canvas.width / 2) - (drawingCenterX * gridSize);
    gridOffset.y = (canvas.height / 2) - (drawingCenterY * gridSize);
    gridOffset.y += 20;

    startGridPos.x = 0;
    startGridPos.y = 0;

    dot = { x: gridOffset.x, y: gridOffset.y, angle: 0 };
    pathHistory = [{ x: dot.x, y: dot.y, angle: dot.angle }];
    redoStack = [];
    if (codeBox) codeBox.innerHTML = '';

    isGameStarted = false;
    gameStartTimeObj = null;

    updateRunButtonState(false);
    toggleGameControls(false);
    draw();
}

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fddfb3ff';
    let startGridX = gridOffset.x % gridSize;
    let startGridY = gridOffset.y % gridSize;

    if (startGridX < 0) startGridX += gridSize;
    if (startGridY < 0) startGridY += gridSize;

    for (let x = startGridX - gridSize; x <= canvas.width + gridSize; x += gridSize) {
        for (let y = startGridY - gridSize; y <= canvas.height + gridSize; y += gridSize) {
            ctx.beginPath(); ctx.arc(x, y, dotSize, 0, Math.PI * 2); ctx.fill();
        }
    }

    if (pathHistory.length > 0) {
        ctx.beginPath(); ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.moveTo(pathHistory[0].x, pathHistory[0].y);
        for (let i = 1; i < pathHistory.length; i++) ctx.lineTo(pathHistory[i].x, pathHistory[i].y);
        ctx.stroke();
    }

    ctx.save(); ctx.translate(dot.x, dot.y); ctx.rotate(((dot.angle - 90) * Math.PI) / 180);
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-7, 6); ctx.lineTo(-5, 0); ctx.lineTo(-7, -6);
    ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();

    validatePathWithDB();
    updateCodeBox();
}

function getCleanPath() {
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

function toggleGameControls(disable) {
    const controls = [btnForward, btnLeft, btnRight, btnUndo, btnRedo, btnReset];
    controls.forEach(btn => {
        if (btn) {
            if (disable) {
                btn.style.pointerEvents = 'none'; btn.style.opacity = '0.5';
            } else {
                btn.style.pointerEvents = 'auto'; btn.style.opacity = '1';
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
        updateProgressAndError(0, false);
        return;
    }

    let isExactMatch = false;
    let maxMatchCount = 0;
    let isCurrentlyOnTrack = false;
    let targetTotalLength = validPaths[0].length;

    validPaths.forEach(targetPath => {
        let matchCount = 0;
        let onThisTrack = true;
        for (let i = 0; i < userGridPath.length; i++) {
            if (i < targetPath.length && userGridPath[i].x === targetPath[i].x && userGridPath[i].y === targetPath[i].y) {
                matchCount++;
            } else {
                onThisTrack = false; break;
            }
        }
        if (matchCount > maxMatchCount) maxMatchCount = matchCount;
        if (onThisTrack) isCurrentlyOnTrack = true;
        if (onThisTrack && userGridPath.length === targetPath.length) isExactMatch = true;
    });

    let percent = 0;
    if (targetTotalLength > 1) {
        percent = Math.floor(((maxMatchCount - 1) / (targetTotalLength - 1)) * 100);
    }
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const hasError = userGridPath.length > 1 && !isCurrentlyOnTrack;
    updateProgressAndError(percent, hasError);

    if (isExactMatch && !previousCorrectState) {
        const successSound = document.getElementById('successSound');
        if (successSound) {
            successSound.currentTime = 0;
            successSound.volume = 0.2;
            successSound.play().catch(e => {});
        }
    }

    previousCorrectState = isExactMatch;
    updateRunButtonState(isExactMatch);
    toggleGameControls(isExactMatch);

    if (isTutorialMode && percent === 100 && tutorialSteps[tutorialStep].action === 'freeplay') {
        advanceTutorial();
    }
}

function updateProgressAndError(percent, hasError) {
    const progressCircle = document.getElementById('progressCircle');
    const innerText = document.querySelector('.inner-circle');
    const oldPercent = parseInt(innerText ? innerText.innerText : "0");

    if (progressCircle && innerText) {
        innerText.innerText = `${percent}%`;
        progressCircle.style.background = `conic-gradient(#bce051 ${percent}%, #ffffff ${percent}%)`;
    }

    const cheerTooltip = document.getElementById('cheerTooltip');
    if (cheerTooltip && percent !== oldPercent) {
        let message = "";
        if (percent === 50) message = "Halfway there! Keep it up!";
        else if (percent === 75) message = "Almost there! You can do it!";
        else if (percent === 100) message = "Success! Great job!";

        if (message !== "") {
            cheerTooltip.innerText = message;
            cheerTooltip.classList.add('show');
            if (cheerTimer) clearTimeout(cheerTimer);
            cheerTimer = setTimeout(() => { cheerTooltip.classList.remove('show'); }, 3000);
        }
    }

    const tooltip = document.getElementById('errorTooltip');
    if (tooltip) {
        if (hasError) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
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

async function saveccv_UserCodeAndStoreId() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const userCommands = Array.from(codeBox.querySelectorAll('.code-item')).map(item => item.innerText).join(', ');
    const cleanPath = getCleanPath();
    const userPoints = cleanPath.map(p => `(${p.x}, ${p.y})`).join(', ');

    const payload = {
        User_ID: 1,
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
        if (data.id) sessionStorage.setItem('lastccv_UserCodeID', data.id);
        return response.ok;
    } catch (error) { return false; }
}

let maxAllowedScrollX = 0;
if (codeBox) {
    codeBox.addEventListener('scroll', () => {
        if (codeBox.scrollLeft > maxAllowedScrollX + 1) codeBox.scrollLeft = maxAllowedScrollX;
    });
}

function updateCodeBox() {
    if (!codeBox) return;
    codeBox.innerHTML = '';
    let groupedCommands = [];

    for (let i = 1; i < pathHistory.length; i++) {
        const current = pathHistory[i];
        const prev = pathHistory[i - 1];
        let type = ""; let className = ""; let isRotation = false; let commandValue = 0;

        if (current.angle !== prev.angle) {
            isRotation = true;
            let diff = current.angle - prev.angle;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            let mathDiff = -diff;
            if (mathDiff > 0) { type = "moveLeft"; className = "item-moveleft"; commandValue = mathDiff; }
            else if (mathDiff < 0) { type = "moveRight"; className = "item-moveright"; commandValue = mathDiff; }
        } else {
            type = "forward"; className = "item-forward"; commandValue = 1;
        }

        let lastCommand = groupedCommands[groupedCommands.length - 1];
        if (lastCommand && lastCommand.type === type) {
            if (isRotation) {
                lastCommand.value += commandValue;
                if (Math.abs(lastCommand.value) >= 360) lastCommand.value = lastCommand.value % 360;
            } else { lastCommand.value += commandValue; }
        } else {
            if (isRotation && commandValue === 0) continue;
            groupedCommands.push({ type, className, value: commandValue, isRotation });
        }
    }

    let currentForwardCount = 0; let currentLeftDegree = 0; let currentRightDegree = 0;
    if (groupedCommands.length > 0) {
        const lastCmd = groupedCommands[groupedCommands.length - 1];
        if (lastCmd.type === "forward") currentForwardCount = lastCmd.value;
        else if (lastCmd.type === "moveLeft") currentLeftDegree = lastCmd.value;
        else if (lastCmd.type === "moveRight") currentRightDegree = Math.abs(lastCmd.value);
    }

    const fwdBadge = document.querySelector('.forward-badge');
    const leftBadge = document.querySelector('.left-badge');
    const rightBadge = document.querySelector('.right-badge');
    if (fwdBadge) { fwdBadge.innerText = currentForwardCount; fwdBadge.style.display = currentForwardCount > 0 ? 'flex' : 'none'; }
    if (leftBadge) { leftBadge.innerText = currentLeftDegree + '°'; leftBadge.style.display = currentLeftDegree > 0 ? 'flex' : 'none'; }
    if (rightBadge) { rightBadge.innerText = currentRightDegree + '°'; rightBadge.style.display = currentRightDegree > 0 ? 'flex' : 'none'; }

    let userGroupedLength = 0;
    groupedCommands.forEach(cmd => {
        if (cmd.isRotation && cmd.value === 0) return;
        const span = document.createElement('span');
        span.className = `code-item actual-code ${cmd.className}`;
        span.innerText = cmd.isRotation ? `${cmd.type}(${cmd.value}°)` : `${cmd.type}(${cmd.value})`;
        codeBox.appendChild(span);
        userGroupedLength++;
    });

    let targetGroupedLength = 0;
    if (validPaths && validPaths.length > 0) {
        const targetPath = validPaths[0];
        let targetAngle = 0; let lastTargetType = "";
        for (let i = 1; i < targetPath.length; i++) {
            const current = targetPath[i]; const prev = targetPath[i - 1];
            let dx = current.x - prev.x; let dy = current.y - prev.y;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (angle < 0) angle += 360;
            let type = "";
            if (angle !== targetAngle) { type = "turn"; targetAngle = angle; }
            else { type = "forward"; }
            if (type !== lastTargetType) { targetGroupedLength++; lastTargetType = type; }
        }
    }

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

    requestAnimationFrame(() => {
        const actualCodes = codeBox.querySelectorAll('.actual-code');
        const placeholders = codeBox.querySelectorAll('.code-item-placeholder');
        let focusElement = null;

        if (actualCodes.length > 0) {
            focusElement = actualCodes[actualCodes.length - 1];
            if (placeholders.length > 0) focusElement = placeholders[0];
        } else if (placeholders.length > 0) { focusElement = placeholders[0]; }

        if (focusElement) {
            const targetScroll = focusElement.offsetLeft + focusElement.offsetWidth - codeBox.clientWidth + 20;
            maxAllowedScrollX = Math.max(0, targetScroll);
            codeBox.scrollTo({ left: maxAllowedScrollX, behavior: 'smooth' });
        } else {
            maxAllowedScrollX = 0;
            codeBox.scrollTo({ left: 0, behavior: 'smooth' });
        }
    });
}

function saveState() { pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle }); redoStack = []; }

// ==========================================
// 3. Custom Page Logic
// ==========================================

window.validateForm = function() {
    const nameInput = document.getElementById('userNameInput');
    const btnConfirm = document.querySelector('.confirm');
    if (!btnConfirm) return;

    const hasName = nameInput && nameInput.value.trim().length > 0;
    const hasColor = currentSelectedColorId !== null;
    const hasTexture = currentSelectedTexture !== null && currentSelectedTexture.toLowerCase() !== 'none';

    if (hasName && hasColor && hasTexture) btnConfirm.disabled = false;
    else btnConfirm.disabled = true;
};

function updateCustomImage() {
    const imgElement = document.getElementById('customResultImg');
    if (!window.currentChallengeIdForCustom || !imgElement || !currentSelectedColorId || !currentSelectedTexture) return;

    // ✅ หรี่แสงลงพร้อมใส่ Transition เพื่อความนุ่มนวล
    imgElement.style.transition = "opacity 0.3s ease";
    imgElement.style.opacity = 0.3;

    const url = `${appURL}/api/get-texture-image?challenge_id=${window.currentChallengeIdForCustom}&color_id=${currentSelectedColorId}&texture_name=${currentSelectedTexture}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.image) {
                currentResultImageName = data.image;
                const newSrc = `${appURL}/img/result-image/${data.image}`;

                // โหลดรูปลับหลัง พอเสร็จให้เปลี่ยน Source แล้วดันแสงขึ้น
                const tempImg = new Image();
                tempImg.onload = () => {
                    imgElement.src = newSrc;
                    imgElement.style.opacity = 1;
                };
                tempImg.onerror = () => {
                    imgElement.src = newSrc;
                    imgElement.style.opacity = 1;
                };
                tempImg.src = newSrc;

            } else {
                imgElement.style.opacity = 1; // กันภาพดำถ้าหาไม่เจอ
            }
        })
        .catch(err => {
            console.error("Error fetching texture image:", err);
            imgElement.style.opacity = 1; // กันภาพดำ
        });
}

window.selectTexture = function(name, el) {
    document.querySelectorAll('.texture-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');

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
    updateCustomImage();
    window.validateForm();
};

async function saveFinalData() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const lastccv_UserCodeID = sessionStorage.getItem('lastccv_UserCodeID');

    if (!lastccv_UserCodeID) return false;

    const storedDuration = sessionStorage.getItem('gameDuration') || 0;
    const storedStartTime = sessionStorage.getItem('gameStartTimeString') || "";
    const storedChallengeID = window.currentChallengeIdForCustom || sessionStorage.getItem('storedChallengeID');

    const userNameInput = document.getElementById('userNameInput');
    const userName = (userNameInput && userNameInput.value.trim() !== "") ? userNameInput.value.trim() : "Unknown";

    if (!currentResultImageName || currentResultImageName === "") {
        const imgEl = document.getElementById('customResultImg');
        if (imgEl && imgEl.src) currentResultImageName = imgEl.src.split('/').pop();
    }

    const payloadGeneral = {
        User_Name: userName,
        Challenge_ID: storedChallengeID ? parseInt(storedChallengeID) : null,
        Image: currentResultImageName,
        Timestamp_Min: storedDuration,
        Time: storedStartTime
    };

    try {
        const reqGen = await fetch(`${appURL}/api/save-general`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payloadGeneral)
        });

        if (!reqGen.ok) throw new Error("Save General Failed");

        const resGen = await reqGen.json();
        const realUserID = resGen.new_user_id;

        if (!realUserID) throw new Error("Failed to get User ID");

        const payloadCode = {
            ccv_UserCode_ID: lastccv_UserCodeID,
            User_ID: realUserID,
            Color_Name: currentSelectedColorName || "Default",
            Texture_Name: currentSelectedTexture || "None"
        };

        const reqCode = await fetch(`${appURL}/api/save-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            body: JSON.stringify(payloadCode)
        });

        if (!reqCode.ok) throw new Error("Save Code Failed");
        return true;

    } catch (error) { return false; }
}

// ==========================================
// 5. Game Controls (Buttons)
// ==========================================
function playCommandSound() {
    const cmdSound = document.getElementById('commandSound');
    if (cmdSound) { cmdSound.currentTime = 0; cmdSound.volume = 0.5; cmdSound.play().catch(e => {}); }
}
function playUndoRedoSound() {
    const urSound = document.getElementById('undoRedoSound');
    if (urSound) { urSound.currentTime = 0; urSound.volume = 0.5; urSound.play().catch(e => {}); }
}

if (btnForward) btnForward.addEventListener('click', () => {
    if (isTutorialMode) {
        const step = tutorialSteps[tutorialStep];
        if (step.action !== 'forward' && step.action !== 'freeplay') return;
    }
    playCommandSound(); recordGameStart();
    const angleInDegree = dot.angle % 360;
    const normalizedAngle = angleInDegree < 0 ? angleInDegree + 360 : angleInDegree;
    const moveDist = (normalizedAngle % 90 !== 0) ? gridSize * Math.sqrt(2) : gridSize;
    const rad = ((dot.angle - 90) * Math.PI) / 180;
    const nextX = dot.x + Math.round(Math.cos(rad) * moveDist);
    const nextY = dot.y + Math.round(Math.sin(rad) * moveDist);
    const buffer = 10;
    if (nextX >= buffer && nextX <= canvas.width - buffer && nextY >= buffer && nextY <= canvas.height - buffer) {
        dot.x = nextX; dot.y = nextY; saveState(); draw();
    }
    if (isTutorialMode && tutorialSteps[tutorialStep].action === 'forward') advanceTutorial();
});

if (btnLeft) btnLeft.addEventListener('click', () => {
    if (isTutorialMode && tutorialSteps[tutorialStep].action !== 'freeplay') return;
    playCommandSound(); recordGameStart(); dot.angle -= 45; saveState(); draw();
});

if (btnRight) btnRight.addEventListener('click', () => {
    if (isTutorialMode) {
        const step = tutorialSteps[tutorialStep];
        if (step.action !== 'right' && step.action !== 'freeplay') return;
    }
    playCommandSound(); recordGameStart(); dot.angle += 45; saveState(); draw();
    if (isTutorialMode && tutorialSteps[tutorialStep].action === 'right') advanceTutorial();
});

if (btnUndo) btnUndo.addEventListener('click', () => {
    if (isTutorialMode && tutorialSteps[tutorialStep].action !== 'freeplay') return;
    if (pathHistory.length > 1) {
        playUndoRedoSound(); redoStack.push(pathHistory.pop());
        dot = { ...pathHistory[pathHistory.length - 1] }; draw();
    }
});

if (btnRedo) btnRedo.addEventListener('click', () => {
    if (isTutorialMode && tutorialSteps[tutorialStep].action !== 'freeplay') return;
    if (redoStack.length > 0) {
        playUndoRedoSound(); const next = redoStack.pop(); pathHistory.push(next);
        dot = { ...next }; draw();
    }
});

if (btnReset) btnReset.addEventListener('click', () => {
    if (isTutorialMode && tutorialSteps[tutorialStep].action !== 'freeplay') return;
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'ต้องการรีเซ็ตใหม่อีกครั้งไหม?',
            text: 'ภาพและโค้ดปัจจุบันจะถูกล้าง',
            showCancelButton: true, confirmButtonText: 'เริ่มใหม่', cancelButtonText: 'ยกเลิก',
            reverseButtons: true, buttonsStyling: false, heightAuto: false, backdrop: 'rgba(0, 0, 0, 0.6)',
            customClass: { popup: 'my-swal-popup', title: 'my-swal-title', htmlContainer: 'my-swal-text', actions: 'my-swal-actions', confirmButton: 'my-swal-confirm', cancelButton: 'my-swal-cancel' }
        }).then((result) => {
            if (result.isConfirmed) {
                const resetSound = document.getElementById('resetSound');
                if (resetSound) { resetSound.currentTime = 0; resetSound.volume = 0.5; resetSound.play().catch(e => {}); }
                sessionStorage.removeItem('userPathHistory'); setupCanvas(startGridPos.x, startGridPos.y);
            }
        });
    }
});

if (btnRun) btnRun.addEventListener('click', async () => {
    if (btnRun.disabled) return;

    if (isTutorialMode && tutorialSteps[tutorialStep].action === 'run') {
        endTutorialAndStartGame();
        return;
    }

    const btnSound = document.getElementById('buttonSound');
    if (btnSound) { btnSound.currentTime = 0; btnSound.volume = 0.4; btnSound.play().catch(e => {}); }

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

// ==========================================
// Random Page New Logic (Auto Spin + Results on Board)
// ==========================================
let previousFinalChallengeId = null;

async function initRandomPage() {
    if (!loadingOverlay) return;
    try {
        if (textLoadingSub) textLoadingSub.innerText = "Randomizing...";
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (resultContainer) resultContainer.style.display = 'none';

        const r = await fetch(`${appURL}/api/all-challenges`);
        allChallenges = await r.json();
        updateQuotaDisplay();

        if (loadingOverlay) loadingOverlay.style.display = 'none';

    } catch (e) {
        console.error("Error loading challenges:", e);
        if (textLoadingSub) textLoadingSub.innerText = "Connection failed";
    }
}

function updateQuotaDisplay() {
    if (numRandomDisplay) numRandomDisplay.innerText = `(${randomQuota})`;
    if (randomQuota <= 0 && btnRandomAction) {
        btnRandomAction.disabled = true;
        btnRandomAction.style.cursor = "not-allowed";
        if (btnRandomBox) btnRandomBox.classList.add('btn-disabled');
    }
}

async function startRandomization(isAuto = false) {
    if (allChallenges.length === 0) await initRandomPage();
    if (allChallenges.length === 0) return;

    if (!isAuto && randomQuota <= 0) return;
    if (!isAuto) {
        randomQuota--;
        updateQuotaDisplay();
    }

    if (btnRandomAction) btnRandomAction.disabled = true;
    if (btnStartGameBox) btnStartGameBox.classList.add('btn-disabled');
    if (btnStartGameAction) btnStartGameAction.disabled = true;

    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'flex';

    if (randomResultImage) {
        randomResultImage.style.display = 'block';
        randomResultImage.classList.add('randomizing');
    }

    if (randomResultText) {
        randomResultText.classList.add('randomizing');
    }

    const randomSound = document.getElementById('randomSound');
    if (randomSound) { randomSound.currentTime = 0; randomSound.play().catch(e => {}); }

    let c = 0;
    let lastSpinId = null;

    const i = setInterval(() => {
        let availableForSpin = allChallenges.filter(ch => ch.Challenge_ID !== lastSpinId);
        if (availableForSpin.length === 0) availableForSpin = allChallenges;

        const idx = Math.floor(Math.random() * availableForSpin.length);
        lastSpinId = availableForSpin[idx].Challenge_ID;

        if (randomResultText) randomResultText.innerText = availableForSpin[idx].Challenge;
        if (randomResultImage && availableForSpin[idx].Original_Image) {
            randomResultImage.src = `${appURL}/img/original-image/${availableForSpin[idx].Original_Image}`;
        }

        if (++c >= 20) {
            clearInterval(i);
            finishRandomization();
        }
    }, 80);
}

function finishRandomization() {
    let availableChallenges = allChallenges.filter(ch => ch.Challenge_ID !== previousFinalChallengeId);
    if (availableChallenges.length === 0) availableChallenges = allChallenges;

    const idx = Math.floor(Math.random() * availableChallenges.length);
    const sel = availableChallenges[idx];
    previousFinalChallengeId = sel.Challenge_ID;

    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'flex';

    if (randomResultImage && sel.Original_Image) {
        randomResultImage.src = `${appURL}/img/original-image/${sel.Original_Image}`;
        randomResultImage.style.display = 'block';
        randomResultImage.classList.remove('randomizing');
    }

    if (randomResultText) {
        randomResultText.innerText = sel.Challenge;
        randomResultText.classList.remove('randomizing');
    }

    if (btnStartGameBox) btnStartGameBox.classList.remove('btn-disabled');
    if (btnStartGameAction) btnStartGameAction.disabled = false;
    if (randomQuota > 0 && btnRandomAction) btnRandomAction.disabled = false;

    sessionStorage.setItem('storedChallengeID', sel.Challenge_ID);
    sessionStorage.setItem('storedChallengeName', sel.Challenge);

    setTimeout(() => {
        const randomSound = document.getElementById('randomSound');
        if (randomSound) randomSound.pause();

        const popupSound = document.getElementById('popupSound');
        if (popupSound) { popupSound.currentTime = 0; popupSound.play().catch(e => {}); }
    }, 500);
}


// ==========================================
// 💡 Initialization DOM (รวมทุกอย่างไว้ที่นี่)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    // ✅ นำค่า ID มาเก็บไว้ในตัวแปร Global ป้องกันการ Error ในหน้า Custom
    window.currentChallengeIdForCustom = urlParams.get('id') || sessionStorage.getItem('storedChallengeID');

    const isTutorialDone = sessionStorage.getItem('tutorialDone');

    // 1. ตรวจสอบหน้า Main Game (มี canvas)
    if (canvas) {
        if (!isTutorialDone) {
            initTutorial();
        } else {
            setupCanvas(); draw(); loadChallengeData(window.currentChallengeIdForCustom || 1);
        }
    }

    // 2. ตรวจสอบหน้า Result
    else if (document.getElementById('resultChallengeName')) {
        const storedName = sessionStorage.getItem('storedChallengeName');
        const nameElement = document.getElementById('resultChallengeName');
        if (storedName && nameElement) { nameElement.innerText = storedName; }

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

                if (p.length > 0) {
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    p.forEach(point => {
                        minX = Math.min(minX, point.x); minY = Math.min(minY, point.y);
                        maxX = Math.max(maxX, point.x); maxY = Math.max(maxY, point.y);
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

    // 3. ตรวจสอบหน้า Random
    if (document.querySelector('.text-random')) {
        setTimeout(() => { startRandomization(true); }, 800);
    }
    if (btnRandomAction) {
        btnRandomAction.addEventListener('click', () => {
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) { btnSound.currentTime = 0; btnSound.play().catch(e => {}); }
            startRandomization(false);
        });
    }
    if (btnStartGameAction) {
        btnStartGameAction.addEventListener('click', () => {
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) { btnSound.currentTime = 0; btnSound.play().catch(e => {}); }
            const currentId = sessionStorage.getItem('storedChallengeID');
            setTimeout(() => { window.location.href = `${appURL}/play?id=${currentId}`; }, 200);
        });
    }

    // 4. การนำทาง (Routing) และ เสียงปุ่ม
    function playButtonSound() {
        const btnSound = document.getElementById('buttonSound');
        if (btnSound) { btnSound.currentTime = 0; btnSound.volume = 0.5; btnSound.play().catch(e => {}); }
    }

    const btnHomePlay = document.querySelector('.bt-play');
    const btnHomeGallery = document.querySelector('.bt-gallery');
    const btnHomeTutorial = document.querySelector('.bt-tutorial');

    if (btnHomePlay) btnHomePlay.addEventListener('click', playButtonSound);
    if (btnHomeGallery) btnHomeGallery.addEventListener('click', playButtonSound);
    if (btnHomeTutorial) btnHomeTutorial.addEventListener('click', playButtonSound);

    const btnGoToCustom = document.getElementById('btnGoToCustom');
    if (btnGoToCustom) {
        btnGoToCustom.addEventListener('click', () => {
            playButtonSound();
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');
                if (currentId) { window.location.href = `${appURL}/custom?id=${currentId}`; }
                else { window.location.href = `${appURL}/custom`; }
            }, 150);
        });
    }

    const btnBackToMain = document.getElementById('btnBackToMain');
    if (btnBackToMain) {
        btnBackToMain.addEventListener('click', () => {
            playButtonSound();
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');
                if (currentId) { window.location.href = `${appURL}/play?id=${currentId}`; }
                else { window.history.back(); }
            }, 150);
        });
    }

    const btnBackToResult = document.getElementById('btnBackToResult');
    if (btnBackToResult) {
        btnBackToResult.addEventListener('click', () => {
            const btnSound = document.getElementById('buttonSound');
            if (btnSound) { btnSound.currentTime = 0; btnSound.volume = 0.5; btnSound.play().catch(e => {}); }
            setTimeout(() => {
                const currentId = new URLSearchParams(window.location.search).get('id') || sessionStorage.getItem('storedChallengeID');
                if (currentId) { window.location.href = `${appURL}/result?id=${currentId}`; }
                else { window.history.back(); }
            }, 150);
        });
    }

    // 5. ตรวจสอบหน้า Custom
    const customResultImg = document.getElementById('customResultImg');
    const boxColorContainer = document.querySelector('.box-color');
    const userNameInput = document.getElementById('userNameInput');
    const imgLoader = document.getElementById('imageLoader');

    if (userNameInput) { userNameInput.addEventListener('input', window.validateForm); }

    if (customResultImg && boxColorContainer) {

        // ✅ ตอนเข้าหน้าแรกสุด บังคับโชว์ Loader และให้รูปโปร่งใสรอไว้ก่อน
        if (imgLoader) imgLoader.style.display = 'flex';
        customResultImg.style.opacity = 0;

        if (window.currentChallengeIdForCustom) {
            fetch(`${appURL}/api/challenge/${window.currentChallengeIdForCustom}`)
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        sessionStorage.setItem('storedChallengeName', data.Challenge);
                        sessionStorage.setItem('storedChallengeID', data.Challenge_ID);
                        if (data.Result_Image) {
                            currentResultImageName = data.Result_Image;

                            // ✅ พอรูปแรกสุดโหลดเสร็จ ค่อยซ่อน Loader ทิ้งถาวร
                            customResultImg.onload = () => {
                                customResultImg.style.transition = "opacity 0.5s ease";
                                customResultImg.style.opacity = 1;
                                if (imgLoader) imgLoader.style.display = 'none';
                            };
                            customResultImg.onerror = () => {
                                customResultImg.style.opacity = 1;
                                if (imgLoader) imgLoader.style.display = 'none';
                            };
                            customResultImg.src = `${appURL}/img/result-image/${data.Result_Image}`;
                        } else {
                            customResultImg.style.opacity = 1; // ✅ เผื่อ API ไม่มีรูป
                            if (imgLoader) imgLoader.style.display = 'none';
                        }
                    }
                }).catch(e => {
                    console.error("Error loading default image:", e);
                    customResultImg.style.opacity = 1; // ✅ เผื่อ API พัง
                    if (imgLoader) imgLoader.style.display = 'none';
                });
        } else {
            customResultImg.style.opacity = 1; // ✅ เผื่อไม่ได้ส่ง ID มา
            if (imgLoader) imgLoader.style.display = 'none';
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
                            window.validateForm();
                        };
                        boxColorContainer.appendChild(div);
                    });
                }
            });
    }

    const btnConfirm = document.querySelector('.confirm');
    if (btnConfirm) {
        window.validateForm();
        btnConfirm.addEventListener('click', async () => {
            playButtonSound();
            const success = await saveFinalData();

            if (success) {
                const mainImage = document.getElementById('customResultImg');
                const modalImage = document.getElementById('finalResultImage');
                const qrImage = document.getElementById('qrResult');

                const userNameInput = document.getElementById('userNameInput');
                const successNameDisplay = document.getElementById('successNameDisplay');
                let playerName = userNameInput ? userNameInput.value.trim() : "";

                if (successNameDisplay) {
                    const finalName = playerName ? playerName : "สำเร็จแล้ว!";
                    successNameDisplay.innerText = finalName;
                    const isThai = /[\u0E00-\u0E7F]/.test(finalName);
                    if (isThai) {
                        successNameDisplay.style.setProperty('font-family', "'Sriracha', cursive", 'important');
                        successNameDisplay.style.setProperty('font-size', '2.5rem', 'important');
                    } else {
                        successNameDisplay.style.setProperty('font-family', "'Caveat', cursive", 'important');
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
                    if (popupSound) { popupSound.currentTime = 0; popupSound.volume = 0.4; popupSound.play().catch(e => {}); }
                    customModal.style.display = "flex";
                }
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
            }
        });
    }

    const btnGalleryGreen = document.querySelector('.btn-gallery-green');
    if (btnGalleryGreen) {
        btnGalleryGreen.addEventListener('click', (e) => {
            playButtonSound();
            e.preventDefault();
            const targetUrl = btnGalleryGreen.getAttribute('href');
            setTimeout(() => { window.location.href = targetUrl; }, 150);
        });
    }

    const btnCloseCustom = document.querySelector('.close-modal');
    if (btnCloseCustom && customModal) btnCloseCustom.addEventListener('click', () => customModal.style.display = "none");
});

// 🚨 Keyboard Shortcuts (Emergency Restart & Auto-Complete)
document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Escape') {
        event.preventDefault();
        sessionStorage.clear();
        if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
            window.location.href = '/';
        } else { window.location.href = appURL; }
    }
    if (event.shiftKey && (event.key === 'f' || event.key === 'F' || event.key === 'ด')) {
        event.preventDefault();
        if (isTutorialMode) return; // ปิดโกงตอนโหมดสอน
        if (!validPaths || validPaths.length === 0) return;
        recordGameStart();
        dot = { x: gridOffset.x, y: gridOffset.y, angle: 0 };
        pathHistory = [{ x: dot.x, y: dot.y, angle: dot.angle }];
        redoStack = [];
        const targetPath = validPaths[0];
        for (let i = 1; i < targetPath.length; i++) {
            const prevNode = targetPath[i - 1]; const currNode = targetPath[i];
            let dx = currNode.x - prevNode.x; let dy = currNode.y - prevNode.y;
            let targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            if (targetAngle < 0) targetAngle += 360;
            if (targetAngle !== dot.angle) {
                dot.angle = targetAngle;
                pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle });
            }
            dot.x = gridOffset.x + (currNode.x * gridSize);
            dot.y = gridOffset.y + (currNode.y * gridSize);
            pathHistory.push({ x: dot.x, y: dot.y, angle: dot.angle });
        }
        draw();
    }
});
