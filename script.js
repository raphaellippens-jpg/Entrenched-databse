const playerName = document.getElementById("playerName");
const danger = document.getElementById("danger");
const difficulty = document.getElementById("difficulty");
const rarity = document.getElementById("rarity");

const dangerValue = document.getElementById("dangerValue");
const difficultyValue = document.getElementById("difficultyValue");

const addPlayerButton = document.getElementById("addPlayer");

const statusText = document.getElementById("status");

const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("playerCount");

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

let players = JSON.parse(localStorage.getItem("players") || "[]");

const rarityColors = {
    "Legendary":"#ff3b30",
    "Rare":"#af52de",
    "Three-Quarters-Rare":"#ff9500",
    "Semi-Rare":"#ffd60a",
    "Uncommon":"#0a84ff",
    "Common":"#34c759"
};

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

function savePlayers(){
    localStorage.setItem("players", JSON.stringify(players));
}

function addPlayer(){

    const name = playerName.value.trim();

    if(name === ""){
        statusText.style.color = "#ff3b30";
        statusText.textContent = "Please enter a player name.";
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

    statusText.style.color="#18a558";
    statusText.textContent="Player added!";

    updatePlayerList();
    drawGraph();
}

addPlayerButton.addEventListener("click", addPlayer);

function deletePlayer(index){
    players.splice(index,1);
    savePlayers();
    updatePlayerList();
    drawGraph();
}

function updatePlayerList(){

    playerCount.textContent = players.length;

    if(players.length===0){
        playerList.innerHTML="No players yet.";
        return;
    }

    playerList.innerHTML="";

    players.forEach((player,index)=>{

        const div=document.createElement("div");
        div.className="player";

        div.innerHTML=`
        <div class="playerInfo">
            <div class="playerName">${player.name}</div>
            <div class="playerStats">
            Danger ${player.danger} • Difficulty ${player.difficulty} • ${player.rarity}
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

window.deletePlayer=deletePlayer;

function drawGraph(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const left=70;
    const top=40;
    const width=canvas.width-120;
    const height=canvas.height-100;

    ctx.lineWidth=2;
    ctx.strokeStyle="#222";

    ctx.beginPath();
    ctx.moveTo(left,top);
    ctx.lineTo(left,top+height);
    ctx.lineTo(left+width,top+height);
    ctx.stroke();

    ctx.setLineDash([8,8]);
    ctx.strokeStyle="#cccccc";

    ctx.beginPath();

    ctx.moveTo(left+width/2,top);
    ctx.lineTo(left+width/2,top+height);

    ctx.moveTo(left,top+height/2);
    ctx.lineTo(left+width,top+height/2);

    ctx.stroke();

    ctx.setLineDash([]);

    for(let i=0;i<=10;i++){

        let x=left+(width*i/10);
        let y=top+height-(height*i/10);

        ctx.fillStyle="#666";

        ctx.fillText(i,x-4,top+height+20);
        ctx.fillText(i,left-22,y+4);

    }

    players.forEach(player=>{

        const x=left+(player.difficulty/10)*width;
        const y=top+height-(player.danger/10)*height;

        ctx.fillStyle=rarityColors[player.rarity];

        ctx.beginPath();
        ctx.arc(x,y,8,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle="#111";
        ctx.fillText(player.name,x+12,y-10);

    });

    if(playerName.value.trim()!=""){

        const x=left+(difficulty.value/10)*width;
        const y=top+height-(danger.value/10)*height;

        ctx.globalAlpha=.35;

        ctx.fillStyle=rarityColors[rarity.value];

        ctx.beginPath();
        ctx.arc(x,y,9,0,Math.PI*2);
        ctx.fill();

        ctx.globalAlpha=1;

    }

}

updatePlayerList();
drawGraph();