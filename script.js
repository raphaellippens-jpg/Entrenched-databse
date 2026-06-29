// ======================================
// Entrenched Database V12
// script.js
// Part 1
// ======================================

// ---------- Elements ----------

const playerName=document.getElementById("playerName");
const danger=document.getElementById("danger");
const difficulty=document.getElementById("difficulty");
const rarity=document.getElementById("rarity");

const dangerValue=document.getElementById("dangerValue");
const difficultyValue=document.getElementById("difficultyValue");

const addPlayer=document.getElementById("addPlayer");

const playerList=document.getElementById("playerList");
const playerCount=document.getElementById("playerCount");

const search=document.getElementById("search");
const sort=document.getElementById("sort");

const themeToggle=document.getElementById("themeToggle");

const status=document.getElementById("status");

const canvas=document.getElementById("graph");
const ctx=canvas.getContext("2d");

// ---------- Constants ----------

const MAX_VALUE=25;

const rarityColors={

Legendary:"#ff3b30",

Epic:"#8b5cf6",

Rare:"#00bcd4",

"Three-Quarters-Rare":"#ff9800",

"Semi-Rare":"#ffd600",

Uncommon:"#2196f3",

Common:"#4caf50"

};

// ---------- Storage ----------

let players=
JSON.parse(
localStorage.getItem("players")||"[]"
);

let darkMode=
localStorage.getItem("theme")==="dark";

if(darkMode){

document.body.classList.add("dark");

themeToggle.textContent="☀️ Light Mode";

}

themeToggle.onclick=()=>{

darkMode=!darkMode;

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
darkMode?"dark":"light"
);

themeToggle.textContent=
darkMode?
"☀️ Light Mode":
"🌙 Dark Mode";

drawGraph();

};

// ---------- Sliders ----------

danger.oninput=()=>{

dangerValue.textContent=danger.value;

drawGraph();

};

difficulty.oninput=()=>{

difficultyValue.textContent=difficulty.value;

drawGraph();

};

playerName.oninput=drawGraph;

rarity.onchange=drawGraph;

// ---------- Add Player ----------

addPlayer.onclick=()=>{

const name=playerName.value.trim();

if(name===""){

status.style.color="#ff3b30";

status.textContent=
"Please enter a player.";

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

danger.value=12;

difficulty.value=12;

dangerValue.textContent=12;

difficultyValue.textContent=12;

status.style.color="#16a34a";

status.textContent=
"Player added!";

refresh();

};

// ---------- Save ----------

function savePlayers(){

localStorage.setItem(
"players",
JSON.stringify(players)
);

// Theme

localStorage.setItem(
"theme",
darkMode?"dark":"light"
);

}
// ---------- Delete ----------

function deletePlayer(index){

players.splice(index,1);

savePlayers();

refresh();

}

window.deletePlayer=deletePlayer;

// ---------- Refresh ----------

function refresh(){

let list=[...players];

const query=
search.value.toLowerCase().trim();

if(query){

list=list.filter(player=>

player.name
.toLowerCase()
.includes(query)

);

}

switch(sort.value){

case "danger":

list.sort(
(a,b)=>
b.danger-a.danger
);

break;

case "difficulty":

list.sort(
(a,b)=>
b.difficulty-a.difficulty
);

break;

case "rarity":

const order={

Legendary:7,

Epic:6,

Rare:5,

"Three-Quarters-Rare":4,

"Semi-Rare":3,

Uncommon:2,

Common:1

};

list.sort(
(a,b)=>
order[b.rarity]-order[a.rarity]
);

break;

default:

list.sort(
(a,b)=>
a.name.localeCompare(b.name)
);

}

playerCount.textContent=
list.length;

playerList.innerHTML="";

if(list.length===0){

playerList.innerHTML=
"No players found.";

}else{

list.forEach(player=>{

const card=
document.createElement("div");

card.className="player";

card.innerHTML=`

<div class="playerInfo">

<div class="playerName">

${player.name}

</div>

<div class="playerStats">

${player.rarity}

<br>

Danger:
${player.danger}/25

<br>

Difficulty:
${player.difficulty}/25

</div>

</div>

<div class="playerButtons">

<button
onclick="deletePlayer(players.indexOf(player))">

Delete

</button>

</div>

`;

playerList.appendChild(card);

});

}

drawGraph();

}

search.oninput=refresh;

sort.onchange=refresh;

// ---------- Graph ----------

function drawGraph(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

const left=90;

const top=50;

const width=
canvas.width-150;

const height=
canvas.height-120;

// Axes

ctx.strokeStyle="#555";

ctx.lineWidth=2;

ctx.beginPath();

ctx.moveTo(left,top);

ctx.lineTo(
left,
top+height
);

ctx.lineTo(
left+width,
top+height
);

ctx.stroke();

// Grid

ctx.strokeStyle=
"rgba(150,150,150,.25)";

for(let i=1;i<MAX_VALUE;i++){

const x=
left+
width*i/MAX_VALUE;

const y=
top+
height-
height*i/MAX_VALUE;

ctx.beginPath();

ctx.moveTo(x,top);

ctx.lineTo(
x,
top+height
);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(left,y);

ctx.lineTo(
left+width,
y
);

ctx.stroke();

}

// Numbers

ctx.fillStyle=
document.body.classList.contains("dark")
?
"#ffffff"
:
"#333333";

ctx.font="13px Arial";

for(let i=0;i<=MAX_VALUE;i++){

ctx.fillText(

i,

left+
width*i/MAX_VALUE-5,

top+height+20

);

ctx.fillText(

i,

left-28,

top+
height-
height*i/MAX_VALUE+5

);

}
// ---------- Draw Players ----------

const usedPositions={};

players.forEach(player=>{

const key=
player.danger+
","+
player.difficulty;

if(!usedPositions[key]){

usedPositions[key]=0;

}

const index=
usedPositions[key]++;

const angle=
index*
(Math.PI/4);

const radius=
index*8;

const offsetX=
Math.cos(angle)*radius;

const offsetY=
Math.sin(angle)*radius;

const x=
left+
(player.difficulty/MAX_VALUE)
*width+
offsetX;

const y=
top+
height-
(player.danger/MAX_VALUE)
*height+
offsetY;

// Dot

ctx.beginPath();

ctx.fillStyle=
rarityColors[player.rarity];

ctx.arc(
x,
y,
8,
0,
Math.PI*2
);

ctx.fill();

// Outline

ctx.lineWidth=2;

ctx.strokeStyle=
"#ffffff";

ctx.stroke();

// Name

ctx.fillStyle=
document.body.classList.contains("dark")
?
"#ffffff"
:
"#111111";

ctx.font="14px Arial";

ctx.fillText(
player.name,
x+12,
y-10
);

});

// ---------- Preview Dot ----------

if(playerName.value.trim()!==""){

const previewX=
left+
(Number(difficulty.value)/MAX_VALUE)
*width;

const previewY=
top+
height-
(Number(danger.value)/MAX_VALUE)
*height;

ctx.globalAlpha=.45;

ctx.beginPath();

ctx.fillStyle=
rarityColors[
rarity.value
];

ctx.arc(
previewX,
previewY,
10,
0,
Math.PI*2
);

ctx.fill();

ctx.globalAlpha=1;

ctx.fillStyle=
document.body.classList.contains("dark")
?
"#ffffff"
:
"#111111";

ctx.fillText(

playerName.value,

previewX+12,

previewY-12

);

}

// Axis titles

ctx.save();

ctx.fillStyle=
document.body.classList.contains("dark")
?
"#ffffff"
:
"#333333";

ctx.font="18px Arial";

ctx.fillText(

"Difficulty",

left+
width/2-40,

canvas.height-25

);

ctx.translate(
25,
canvas.height/2
);

ctx.rotate(
-Math.PI/2
);

ctx.fillText(

"Danger",

0,

0

);

ctx.restore();

}

// ---------- Start ----------

refresh();    
