// ======================================
// Entrenched Database V13
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

// ---------- Modal ----------

const playerModal=
document.getElementById("playerModal");

const deleteModal=
document.getElementById("deleteModal");

const modalName=
document.getElementById("modalName");

const modalRarity=
document.getElementById("modalRarity");

const modalDanger=
document.getElementById("modalDanger");

const modalDifficulty=
document.getElementById("modalDifficulty");

const modalDescription=
document.getElementById("modalDescription");

const saveDescription=
document.getElementById("saveDescription");

const editPlayerButton=
document.getElementById("editPlayer");

const deletePlayerButton=
document.getElementById("deletePlayerModal");

const closeModal=
document.getElementById("closeModal");

const cancelDelete=
document.getElementById("cancelDelete");

const confirmDelete=
document.getElementById("confirmDelete");

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

players.forEach(player=>{

if(player.id===undefined){

player.id=
Date.now().toString()+
Math.random().toString();

}else{

player.id=
String(player.id);

}

if(player.description===undefined){

player.description="";

}

});

let selectedPlayer=null;

let darkMode=
localStorage.getItem("theme")==="dark";

applyTheme(false);

function applyTheme(save=true){

document.body.classList.toggle(
"dark",
darkMode
);

themeToggle.textContent=
darkMode?
"☀️ Light Mode":
"🌙 Dark Mode";

if(save){

localStorage.setItem(
"theme",
darkMode?"dark":"light"
);

}

drawGraph();

}

themeToggle.onclick=()=>{

darkMode=!darkMode;

applyTheme();

};

// ---------- Sliders ----------

danger.oninput=()=>{

dangerValue.textContent=
danger.value;

drawGraph();

};

difficulty.oninput=()=>{

difficultyValue.textContent=
difficulty.value;

drawGraph();

};

playerName.oninput=
drawGraph;

rarity.onchange=
drawGraph;

// ---------- Add Player ----------

addPlayer.onclick=()=>{

const name=
playerName.value.trim();

if(name===""){

status.style.color=
"#ff3b30";

status.textContent=
"Please enter a player.";

return;

}

players.push({

id:
Date.now().toString()+
Math.random().toString(),

name:name,

danger:Number(
danger.value
),

difficulty:Number(
difficulty.value
),

rarity:rarity.value,

description:""

});

savePlayers();

playerName.value="";

danger.value=12;

difficulty.value=12;

dangerValue.textContent=12;

difficultyValue.textContent=12;

status.style.color=
"#16a34a";

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

localStorage.setItem(

"theme",

darkMode?
"dark":
"light"

);

}

// ---------- Modal Functions ----------

function openPlayer(player){

selectedPlayer=player;

modalName.textContent=
player.name;

modalRarity.textContent=
player.rarity;

modalDanger.textContent=
player.danger+"/25";

modalDifficulty.textContent=
player.difficulty+"/25";

modalDescription.value=
player.description;

playerModal.classList.remove(
"hidden"
);

}

function closePlayer(){

selectedPlayer=null;

playerModal.classList.add(
"hidden"
);

}

closeModal.onclick=
closePlayer;

playerModal.onclick=e=>{

if(e.target===playerModal){

closePlayer();

}

};

saveDescription.onclick=()=>{

if(!selectedPlayer){

return;

}

selectedPlayer.description=
modalDescription.value;

savePlayers();

status.style.color=
"#16a34a";

status.textContent=
"Description saved.";

};

deletePlayerButton.onclick=()=>{

deleteModal.classList.remove(
"hidden"
);

};

cancelDelete.onclick=()=>{

deleteModal.classList.add(
"hidden"
);

};

confirmDelete.onclick=()=>{

if(!selectedPlayer){

return;

}

deletePlayer(
selectedPlayer.id
);

deleteModal.classList.add(
"hidden"
);

closePlayer();

};

// ---------- Delete ----------

function deletePlayer(id){

players=

players.filter(player=>

String(player.id)!==
String(id)

);

savePlayers();

refresh();

}

window.deletePlayer=
deletePlayer;

// ---------- Refresh ----------

function refresh(){

let list=[...players];

const query=
search.value
.toLowerCase()
.trim();

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

const rarityOrder={

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
rarityOrder[b.rarity]-
rarityOrder[a.rarity]
);

break;

default:

list.sort(
(a,b)=>
a.name.localeCompare(
b.name
)
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

card.className=
"player";

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

<button class="infoBtn">

Open

</button>

<button class="deleteBtn">

Delete

</button>

</div>

`;

const info=

card.querySelector(
".infoBtn"
);

info.onclick=()=>{

openPlayer(
player
);

};

const del=

card.querySelector(
".deleteBtn"
);

del.onclick=()=>{

deletePlayer(
player.id
);

};

playerList.appendChild(
card
);

});

}

drawGraph(list);

}

search.oninput=
refresh;

sort.onchange=
refresh;

// ---------- Graph ----------

// CONTINUES IN PART 2
// ---------- Graph ----------

function drawGraph(displayPlayers){

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

// Theme colors

const style=
getComputedStyle(
document.body
);

const textColor=
style
.getPropertyValue(
"--graphText"
)
.trim();

const gridColor=
style
.getPropertyValue(
"--graphGrid"
)
.trim();

const axisColor=
style
.getPropertyValue(
"--graphOutline"
)
.trim();

// ---------- Axes ----------

ctx.strokeStyle=
axisColor;

ctx.lineWidth=2;

ctx.beginPath();

ctx.moveTo(
left,
top
);

ctx.lineTo(
left,
top+height
);

ctx.lineTo(
left+width,
top+height
);

ctx.stroke();

// ---------- Grid ----------

ctx.strokeStyle=
gridColor;

for(
let i=1;
i<MAX_VALUE;
i++
){

const x=
left+
width*i/
MAX_VALUE;

const y=
top+
height-
height*i/
MAX_VALUE;

ctx.beginPath();

ctx.moveTo(
x,
top
);

ctx.lineTo(
x,
top+height
);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(
left,
y
);

ctx.lineTo(
left+width,
y
);

ctx.stroke();

}

// ---------- Numbers ----------

ctx.fillStyle=
textColor;

ctx.font=
"13px Arial";

for(
let i=0;
i<=MAX_VALUE;
i++
){

ctx.fillText(

i,

left+
width*i/
MAX_VALUE-
5,

top+
height+
20

);

ctx.fillText(

i,

left-
28,

top+
height-
height*i/
MAX_VALUE+
5

);

}

// ---------- Players ----------

const usedPositions={};

(displayPlayers||players)
.forEach(player=>{

const key=

player.danger+
","+
player.difficulty;

if(
!usedPositions[key]
){

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
Math.cos(angle)
*radius;

const offsetY=
Math.sin(angle)
*radius;

const x=

left+

(player.difficulty/
MAX_VALUE)

*width+

offsetX;

const y=

top+

height-

(player.danger/
MAX_VALUE)

*height+

offsetY;

// Circle

ctx.beginPath();

ctx.fillStyle=

rarityColors[
player.rarity
];

ctx.arc(

x,

y,

8,

0,

Math.PI*2

);

ctx.fill();

ctx.lineWidth=2;

ctx.strokeStyle=
"#ffffff";

ctx.stroke();

// Name

ctx.fillStyle=
textColor;

ctx.font=
"14px Arial";

ctx.fillText(

player.name,

x+12,

y-10

);

// Detect click

player.graphX=x;

player.graphY=y;

});

// ---------- Preview ----------

if(

playerName.value.trim()
!==""


){

const previewX=

left+

Number(
difficulty.value
)

/
MAX_VALUE

*width;

const previewY=

top+

height-

Number(
danger.value
)

/
MAX_VALUE

*height;

ctx.globalAlpha=.4;

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
textColor;

ctx.fillText(

playerName.value,

previewX+12,

previewY-12

);

}

// ---------- Titles ----------

ctx.save();

ctx.fillStyle=
textColor;

ctx.font=
"18px Arial";

ctx.fillText(

"Difficulty",

left+
width/2-
40,

canvas.height-
25

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

// ---------- Graph Click ----------

canvas.onclick=e=>{

const rect=

canvas
.getBoundingClientRect();

const scaleX=

canvas.width/
rect.width;

const scaleY=

canvas.height/
rect.height;

const mouseX=

(e.clientX-
rect.left)

*scaleX;

const mouseY=

(e.clientY-
rect.top)

*scaleY;

for(
const player
of players
){

const dx=

mouseX-
player.graphX;

const dy=

mouseY-
player.graphY;

const distance=

Math.sqrt(
dx*dx+
dy*dy
);

if(
distance<12
){

openPlayer(
player
);

return;

}

}

};

// ---------- Start ----------

refresh();
// ======================================
// V13
// Part 3
// ======================================

// ---------- Future Edit System ----------

editPlayerButton.onclick=()=>{

if(!selectedPlayer){

return;

}

playerName.value=
selectedPlayer.name;

danger.value=
selectedPlayer.danger;

difficulty.value=
selectedPlayer.difficulty;

rarity.value=
selectedPlayer.rarity;

dangerValue.textContent=
danger.value;

difficultyValue.textContent=
difficulty.value;

// Remove old player

players=

players.filter(player=>

player.id!==selectedPlayer.id

);

savePlayers();

refresh();

closePlayer();

status.style.color=
"#0a84ff";

status.textContent=
"Editing player... Make changes then press Add Player.";

};

// ---------- Escape Key ----------

document.addEventListener(

"keydown",

e=>{

if(

e.key==="Escape"

){

playerModal.classList.add(

"hidden"

);

deleteModal.classList.add(

"hidden"

);

selectedPlayer=null;

}

}

);

// ---------- Close Delete Modal ----------

deleteModal.onclick=e=>{

if(

e.target===deleteModal

){

deleteModal.classList.add(

"hidden"

);

}

};

// ---------- Auto Save Description ----------

modalDescription.oninput=()=>{

if(

!selectedPlayer

){

return;

}

selectedPlayer.description=

modalDescription.value;

savePlayers();

};

// ---------- Helper ----------

function findPlayer(id){

return players.find(

player=>

player.id===id

);

}

// ---------- Future Custom Labels ----------

const labels={

danger:"Danger",

difficulty:"Difficulty",

rarity:"Rarity",

description:"Description"

};

// ---------- Future Statistics ----------

function getAverageDanger(){

if(

players.length===0

){

return 0;

}

let total=0;

players.forEach(player=>{

total+=player.danger;

});

return(

total/

players.length

).toFixed(1);

}

function getAverageDifficulty(){

if(

players.length===0

){

return 0;

}

let total=0;

players.forEach(player=>{

total+=player.difficulty;

});

return(

total/

players.length

).toFixed(1);

}

// ---------- Future Highest Danger ----------

function highestDanger(){

if(

players.length===0

){

return null;

}

return players.reduce(

(a,b)=>

a.danger>b.danger

?

a

:

b

);

}

// ---------- Future Highest Difficulty ----------

function highestDifficulty(){

if(

players.length===0

){

return null;

}

return players.reduce(

(a,b)=>

a.difficulty>

b.difficulty

?

a

:

b

);

}

// ---------- End ----------

refresh();
