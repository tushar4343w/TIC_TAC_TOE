const cells=document.querySelectorAll(".cell");
const statusText=document.getElementById("status");
const scoreX=document.getElementById("scoreX");
const scoreO=document.getElementById("scoreO");
const scoreDraw=document.getElementById("scoreDraw");

let board=["","","","","","","","",""];
let currentPlayer="X";
let gameActive=false;
let scores=JSON.parse(localStorage.getItem("tttScores"))||{X:0,O:0,draw:0};

updateScoreUI();

const winPatterns=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

cells.forEach(cell=>{
  cell.addEventListener("click",handleClick);
});

function startGame(){
  gameActive=true;
  statusText.textContent="Game Started!";
}

function handleClick(e){
  const index=e.target.dataset.index;
  if(board[index]!==""||!gameActive) return;

  makeMove(index,currentPlayer);
  if(checkResult()) return;

  switchPlayer();

  if(document.getElementById("modeSelect").value==="ai" && currentPlayer==="O"){
    setTimeout(aiMove,500);
  }
}

function makeMove(index,player){
  board[index]=player;
  cells[index].textContent=player;
  cells[index].classList.add("pop");
  setTimeout(()=>cells[index].classList.remove("pop"),250);
}

function switchPlayer(){
  currentPlayer=currentPlayer==="X"?"O":"X";
  statusText.textContent=`${getPlayerName(currentPlayer)} Turn`;
}

function getPlayerName(symbol){
  if(symbol==="X")
    return document.getElementById("player1").value||"Player X";
  else
    return document.getElementById("player2").value||"Player O";
}

function aiMove(){
  let empty=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move=empty[Math.floor(Math.random()*empty.length)];
  makeMove(move,"O");
  if(checkResult()) return;
  switchPlayer();
}

function checkResult(){
  for(let pattern of winPatterns){
    const [a,b,c]=pattern;
    if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
      gameActive=false;
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      scores[board[a]]++;
      localStorage.setItem("tttScores",JSON.stringify(scores));
      updateScoreUI();

      statusText.textContent=`${getPlayerName(board[a])} Wins!`;
      return true;
    }
  }

  if(!board.includes("")){
    gameActive=false;
    scores.draw++;
    localStorage.setItem("tttScores",JSON.stringify(scores));
    updateScoreUI();

    document.body.classList.add("draw-effect");
    setTimeout(()=>document.body.classList.remove("draw-effect"),800);

    statusText.textContent="Draw!";
    return true;
  }
  return false;
}

function restartGame(){
  board=["","","","","","","","",""];
  gameActive=true;
  currentPlayer="X";
  statusText.textContent="Game Restarted";
  cells.forEach(cell=>{
    cell.textContent="";
    cell.classList.remove("win");
  });
}

function resetScores(){
  scores={X:0,O:0,draw:0};
  localStorage.removeItem("tttScores");
  updateScoreUI();
}

function updateScoreUI(){
  scoreX.textContent=`X: ${scores.X}`;
  scoreO.textContent=`O: ${scores.O}`;
  scoreDraw.textContent=`Draw: ${scores.draw}`;
}

function toggleTheme(){
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}
