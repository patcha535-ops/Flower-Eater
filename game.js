const size = 7;
const flowerTypes = ["🌹", "🌻"];
const targetFlower = "🌷";
let board = [];
let score = 0;
let gameStarted = false;

function initGame() {
    score = 0;
    gameStarted = false;
    document.getElementById("score").innerText = score;
    document.getElementById("message").innerText = "คลิกที่ดอกไม้เพื่อเริ่มสุ่มช่องว่าง!";
    
    board = Array(size).fill().map(() => Array(size).fill(null));

    // 1. วางทิวลิป 🌷 ล็อกไว้ที่พิกัดกลาง (3,3)
    const mid = 3;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (r === mid && c === mid) {
                board[r][c] = targetFlower;
            } else {
                board[r][c] = flowerTypes[Math.floor(Math.random() * 2)];
            }
        }
    }

    createGrid();
    render();
    updateCount();
}

function createGrid() {
    const garden = document.getElementById("garden");
    garden.innerHTML = "";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const tile = document.createElement("div");
            tile.className = "plot";
            tile.id = `tile-${r}-${c}`;
            tile.onclick = () => handleAction(r, c);
            garden.appendChild(tile);
        }
    }
}

// ✨ ฟังก์ชันสุ่มหาย 1 ช่อง เมื่อเริ่มเกม
function startRandomGap() {
    if (gameStarted) return;

    let r, c;
    do {
        r = Math.floor(Math.random() * size);
        c = Math.floor(Math.random() * size);
    } while (r === 3 && c === 3); // ห้ามสุ่มโดนทิวลิปตรงกลาง

    board[r][c] = null;
    gameStarted = true;
    document.getElementById("message").innerText = "เริ่มแล้ว! ดันดอกไม้ให้ตรงสีที่มุม";
    render();
    updateCount();
    
    // หมายเหตุ: เอา checkAllEaters() ออกจากตรงนี้เพื่อให้คลิกแรกหายแค่ช่องเดียว
}

function handleAction(r, c) {
    if (!gameStarted) {
        startRandomGap(); 
    } else {
        moveFlower(r, c);
    }
}

function moveFlower(r, c) {
    const flower = board[r][c];
    if (!flower) return;

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === null) {
            board[nr][nc] = flower;
            board[r][c] = null;
            render();
            checkAllEaters(); // จะเริ่มกินก็ต่อเมื่อมีการขยับเท่านั้น
            return;
        }
    }
}

function checkAllEaters() {
    let hasEaten = false;

    // 🔒 ระบบตรวจสอบการกินที่พิกัดมุมแบบ Strict
    // 1. บนซ้าย (0,0) -> กุหลาบ 🌹
    if (board[0][0] === "🌹") { board[0][0] = null; hasEaten = true; }
    
    // 2. บนขวา (0,6) -> ทานตะวัน 🌻
    if (board[0][6] === "🌻") { board[0][6] = null; hasEaten = true; }
    
    // 3. ขวาล่าง (6,6) -> ทิวลิป 🌷 (เป้าหมายหลัก)
    if (board[6][6] === "🌷") {
        board[6][6] = null;
        hasEaten = true;
        render();
        setTimeout(() => {
            alert("ยินดีด้วยครับคุณ Jarvis! ภารกิจสำเร็จ!");
            initGame();
        }, 300);
        return;
    }

    if (hasEaten) {
        score += 1000;
        document.getElementById("score").innerText = score;
        render();
        updateCount();
        setTimeout(checkAllEaters, 150); 
    }
}

function render() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            if (tile) {
                tile.innerText = board[r][c] || "";
                tile.className = board[r][c] ? "plot" : "plot empty";
            }
        }
    }
}

function updateCount() {
    let count = 0;
    board.forEach(row => row.forEach(cell => { if(cell) count++; }));
    document.getElementById("count").innerText = count;
}

document.getElementById("reset-btn").onclick = () => initGame();

initGame();