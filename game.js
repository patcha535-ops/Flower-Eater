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
    document.getElementById("message").innerText = "คลิกที่ดอกไม้เพื่อสุ่มช่องว่าง!";
    
    board = Array(size).fill().map(() => Array(size).fill(null));

    // 1. ล็อกทิวลิป 🌷 ไว้ที่กลาง (3,3)
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

function startRandomGap() {
    if (gameStarted) return;
    let r, c;
    do {
        r = Math.floor(Math.random() * size);
        c = Math.floor(Math.random() * size);
    } while (r === 3 && c === 3); 

    board[r][c] = null;
    gameStarted = true;
    document.getElementById("message").innerText = "เริ่มแล้ว! ดันดอกไม้ให้ตรงสีที่มุม";
    render();
    updateCount();
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
            // ✨ ตรวจสอบการกินทันทีหลังจากขยับเสร็จ
            checkAllEaters(); 
            return;
        }
    }
}

function checkAllEaters() {
    let hasEaten = false;

    // 🔒 ระบบตรวจสอบมุมแบบ Hard-coded พิกัด (Row, Column)
    // มุมบนซ้าย (0,0) -> 🌹
    if (board[0][0] === "🌹") {
        board[0][0] = null;
        hasEaten = true;
    }
    // มุมบนขวา (0,6) -> 🌻
    if (board[0][6] === "🌻") {
        board[0][6] = null;
        hasEaten = true;
    }
    // มุมขวาล่าง (6,6) -> 🌷
    if (board[6][6] === "🌷") {
        board[6][6] = null;
        hasEaten = true;
        render(); // วาดบอร์ดล่าสุดก่อนแจ้งเตือน
        setTimeout(() => {
            alert("ยอดเยี่ยมมากครับคุณ Jarvis! ภารกิจสำเร็จ!");
            initGame();
        }, 300);
        return;
    }

    if (hasEaten) {
        score += 1000;
        document.getElementById("score").innerText = score;
        render();
        updateCount();
        // 🔁 เช็คซ้ำอีกรอบเผื่อมีตัวใหม่เลื่อนมาอยู่ในตำแหน่งกินทันที
        setTimeout(checkAllEaters, 100);
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