// ================================
// Entrenched Player Database V11
// ================================

const playerName = document.getElementById("playerName");
const danger = document.getElementById("danger");
const difficulty = document.getElementById("difficulty");
const rarity = document.getElementById("rarity");

const dangerValue = document.getElementById("dangerValue");
const difficultyValue = document.getElementById("difficultyValue");

const addPlayerBtn = document.getElementById("addPlayer");

const status = document.getElementById("status");

const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("playerCount");

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const rarityColors = {

    Legendary:"#ff3b30",

    Epic:"#8b5cf6",

    Rare:"#06b6d4",

    "Three-Quarters-Rare":"#f59e0b",

    "Semi-Rare":"#eab308",

    Uncommon:"#3b82f6",

    Common:"#22c55e"

};

let players = JSON.parse(
    localStorage.getItem("players") || "[]"
);

function savePlayers(){

    localStorage.setItem(
        "players",
        JSON.stringify(players)
    );

}

danger.oninput = () => {

    dangerValue.textContent = danger.value;

    drawGraph();

};

difficulty.oninput = () => {

    difficultyValue.textContent = difficulty.value;

    drawGraph();

};

playerName.oninput = drawGraph;

rarity.onchange = drawGraph;

addPlayerBtn.onclick = () => {

    const name = playerName.value.trim();

    if(name===""){

        status.style.color="#ef4444";

        status.textContent="Please enter a player name.";

        return;

    }

    players.push({

        name:name,

        danger:Number(danger.value),

        difficulty:Number(difficulty.value),

        rarity:rarity.value

    });

    savePlayers();

    playerName.value="";

    danger.value=5;

    difficulty.value=5;

    dangerValue.textContent="5";

    difficultyValue.textContent="5";

    status.style.color="#16a34a";

    status.textContent="Player added!";

    refresh();

};

function deletePlayer(index){

    players.splice(index,1);

    savePlayers();

    refresh();

}

window.deletePlayer = deletePlayer;

function refresh(){

    playerCount.textContent = players.length;

    playerList.innerHTML = "";

    if(players.length===0){

        playerList.innerHTML = "No players yet.";

    }else{

        players.forEach((player,index)=>{

            const div = document.createElement("div");

            div.className = "player";

            div.innerHTML = `
                <div class="playerInfo">

                    <div class="playerName">
                        ${player.name}
                    </div>

                    <div class="playerStats">
                        ${player.rarity}
                        • Danger ${player.danger}
                        • Difficulty ${player.difficulty}
                    </div>

                </div>

                <div class="playerButtons">

                    <button onclick="deletePlayer(${index})">
                        Delete
                    </button>

                </div>
            `;

            playerList.appendChild(div);

        });

    }

    drawGraph();

}

function drawGraph(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const left = 70;
    const top = 30;
    const width = canvas.width - 110;
    const height = canvas.height - 80;

    ctx.lineWidth = 2;

    ctx.strokeStyle = "#333";

    ctx.beginPath();

    ctx.moveTo(left,top);

    ctx.lineTo(left,top+height);

    ctx.lineTo(left+width,top+height);

    ctx.stroke();

    ctx.strokeStyle = "#dddddd";

    for(let i=1;i<10;i++){

        const x = left + width*i/10;

        const y = top + height - height*i/10;

        ctx.beginPath();

        ctx.moveTo(x,top);

        ctx.lineTo(x,top+height);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(left,y);

        ctx.lineTo(left+width,y);

        ctx.stroke();

    }

    for(let i=0;i<=10;i++){

        ctx.fillStyle="#666";

        ctx.fillText(
            i,
            left+width*i/10-3,
            top+height+18
        );

        ctx.fillText(
            i,
            left-18,
            top+height-height*i/10+4
        );

    }

    players.forEach(player=>{

        const x =
            left +
            (player.difficulty/10)*width;

        const y =
            top +
            height -
            (player.danger/10)*height;

        ctx.fillStyle =
            rarityColors[player.rarity];

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            8,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle="#111";

        ctx.font="14px Arial";

        ctx.fillText(
            player.name,
            x+10,
            y-10
        );

    });

    if(playerName.value.trim()!==""){

        const x =
            left +
            (difficulty.value/10)*width;

        const y =
            top +
            height -
            (danger.value/10)*height;

        ctx.globalAlpha = 0.35;

        ctx.fillStyle =
            rarityColors[rarity.value];

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            9,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.globalAlpha = 1;

    }

}

refresh();
