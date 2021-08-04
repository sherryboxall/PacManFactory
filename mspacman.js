let count = 0;
let gCount = 0;
let stop = false;
let started = false;
let score = 0;
const ghosts = [];

let speed = 6;

let d = {'left' : {'transform' : 'rotateY(180deg)','speed' : -speed,'row':0,'col':-1},
         'right' : {'transform' : 'rotate(0deg)','speed' : speed,'row':0,'col':1},
         'up' : {'transform' : 'rotate(90deg) rotateY(180deg)','speed' : -speed,'row':-1,'col':0},
         'down' : {'transform' : 'rotate(90deg)','speed' : speed,'row':1,'col':0}}

let board = ['XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
             'X-------X-----------X-------X',
             'XB------X-----------X-----B-X',
             'X--XXX--X--XXXXXXX--X--XXX--X',
             'X---------------------------X',
             'X---------------------------X',
             'XXX--X--XXXX--X--XXXX--X--XXX',
             'XXX--X--XXXX--X--XXXX--X--XXX',
             '-----X--------X--------X-----',
             '-----X--------X--------X-----',
             'XXX--XXXX--XXXXXXX--XXXX--XXX',
             'SSX------SSSSSSSSSSS------XSS',
             'SSX------SSSSSSSSSSS------XSS',
             'SSX--XXXXSSGGGGGGGSSXXXX--XSS',
             'SSX--X---SSGGGGGGGSS---X--XSS',
             'SSX--X---SSGGGGGGGSS---X--XSS',
             'XXX--X--XSSGGGGGGGSSX--X--XXX',
             '--------XSSSSSSSSSSSX--------',
             '--------XSSSSSSSSSSSX--------',
             'XXX--XXXXXXX--X--XXXXXXX--XXX',
             'SSX-----------X-----------XSS',
             'SSX-----------X-----------XSS',
             'XXX--XXXX--XXXXXXX--XXXX--XXX',
             'X-------------P-------------X',    
             'X---------------------------X',  
             'X--XXX--XXXX--X--XXXX--XXX--X',    
             'X--XXX--X-----X-----X--XXX--X',    
             'XB-XXX--X-----X-----X--XXXB-X',    
             'X--XXX--X--XXXXXXX--X--XXX--X',    
             'X---------------------------X',    
             'X---------------------------X',    
             'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'];



let height = +window.innerHeight - 40;
let width = +window.innerWidth - 40;
let rowHeight = Math.floor(height / ((board.length + 2) * speed)) * speed;
let colHeight = Math.floor((+window.innerWidth - 40) / (board[0].length * speed)) * speed;
let cellW = Math.min(rowHeight,colHeight);

let pacWidth = cellW * 1.5;
let dotWidth = Math.floor(cellW / 9) * 2;

let pacPos = {'col' : 0, 'colM' : 1, 'row' : 0, 'rowM' : 1}; 

for (let i = 0; i < board.length; i++) {
  let thisRow = board[i];
  if (thisRow.includes('P')) {
    pacPos.col = thisRow.indexOf('P');
    pacPos.colM = thisRow.indexOf('P') + 1;
    pacPos.row = i;
    pacPos.rowM = i + 1;
    break;
  }
}

function startGame() {

  if (stop == false && started == false) {
    update();
    setTimeout(updateGhosts,3000);
    started = true;
    let readyDiv = document.getElementById('ready');
    readyDiv.style.display = 'none';
  }
  else {
    stop = !stop;
  }

  buttonSwap(`start`);

}

function checkCorners(pos) {

  let res = {'borderTopLeft' : 'none', 'borderTopRight' : 'none', 'borderBottomLeft' : 'none', 'borderBottomRight' : 'none'};
  let n = checkNeighbors(pos);
  if (n.top.search(/[\-SPB]/) > -1 && n.topRight.search(/[\-SPB]/) > -1 && n.right.search(/[\-SPB]/) > -1) {res.borderTopRight = 'hall';}
  if (n.right.search(/[\-SPB]/) > -1 && n.bottomRight.search(/[\-SPB]/) > -1 && n.bottom.search(/[\-SPB]/) > -1) {res.borderBottomRight = 'hall';}
  if (n.bottom .search(/[\-SPB]/) > -1 && n.bottomLeft.search(/[\-SPB]/) > -1 && n.left.search(/[\-SPB]/) > -1) {res.borderBottomLeft = 'hall';}
  if (n.left.search(/[\-SPB]/) > -1 && n.topLeft.search(/[\-SPB]/) > -1 && n.top.search(/[\-SPB]/) > -1) {res.borderTopLeft = 'hall';}
  if (n.top === 'X' && n.topRight === 'X' && n.right === 'X') {res.borderTopRight = 'wall';}
  if (n.right === 'X' && n.bottomRight === 'X' && n.bottom === 'X') {res.borderBottomRight = 'wall';}
  if (n.bottom === 'X' && n.bottomLeft === 'X' && n.left === 'X') {res.borderBottomLeft = 'wall';}
  if (n.left === 'X' && n.topLeft === 'X' && n.top === 'X') {res.borderTopLeft = 'wall';}

  return res;

}

function checkNeighbors(pos) {

  let col = pos.col;
  let row = pos.row;

  let res = {'top' : 'E', 'topRight' : 'E', 'right' : 'E', 'bottomRight' : 'E',
             'bottom' : 'E', 'bottomLeft' : 'E', 'left' : 'E', 'topLeft' : 'E'};

  if (row > 0) {res.top = board[row - 1].charAt(col)};
  if (row > 0 && col + 1 < board[0].length) {res.topRight = board[row - 1].charAt(col + 1);}
  if (col + 1 < board[0].length) {res.right = board[row].charAt(col + 1);}
  if (col + 1 < board[0].length && row < board.length - 1) {res.bottomRight = board[row + 1].charAt(col + 1);}
  if (row + 1 < board.length) {res.bottom = board[row + 1].charAt(col);}
  if (row + 1 < board.length && col > 0 ) {res.bottomLeft = board[row + 1].charAt(col - 1);}
  if (col > 0) {res.left= board[row].charAt(col - 1);}
  if (col > 0 && row > 0) {res.topLeft = board[row - 1].charAt(col - 1);}

  return res;

}

function drawBoard(board) {

  dotCount = 0;
  let game = document.getElementById('game');
  let scoreDiv = document.getElementById('score-board');
  let ghostStartRow = -1;
  let ghostStartCol = -1;
  scoreDiv.style.left = (board[0].length * cellW - parseInt(scoreDiv.style.width)) + "px";

  board.forEach((x,i)=>{

    if (x.includes('G') && ghostStartRow === -1) {ghostStartCol = x.indexOf('G');ghostStartRow = i;}

    for (let j = 0; j < x.length; j++) {

      if (x.charAt(j) === 'X') {

        let block = document.createElement('div');
        block.style.position = "absolute";
        block.style.zIndex = "50";
        block.style.backgroundColor = "#f4bb9c";
        //block.style.backgroundColor = "#ff9884";
        block.style.top = cellW * i;
        block.style.left = cellW * j;
        block.style.height = cellW;
        block.style.width = cellW;

        let corners = checkCorners({'col' : j,'row' : i});

        for (c in corners) {
          if (corners[c] === 'hall') {
            block['style'][c + 'Radius'] = cellW / 2 + "px";
          }
        }

        let neighbors = checkNeighbors({'col' : j,'row' : i});
        if (neighbors.left.search(/[\-SPB]/) > -1) { block.style.borderLeft = 'solid 3px #e33022'; }
        if (neighbors.right.search(/[\-SPB]/) > -1) { block.style.borderRight = 'solid 3px #e33022'; }
        if (neighbors.top.search(/[\-SPB]/) > -1) { block.style.borderTop = 'solid 3px #e33022'; }
        if (neighbors.bottom.search(/[\-SPB]/) > -1) { block.style.borderBottom = 'solid 3px #e33022'; }

        game.appendChild(block);

      } else {

        // Make the dots!

        let corners = checkCorners({'row':i,'col':j});

        if (corners.borderBottomRight === 'hall' 
            && board[i].charAt(j) !== 'P' 
            && board[i].charAt(j) !== 'G' 
            && board[i].charAt(j+1) !== 'P' 
            && board[i].charAt(j+1) !== 'S' 
            && board[i+1].charAt(j) !== 'S' 
            ) {
          let dot = document.createElement('div');
          dot.style.position = "absolute";
          dot.id = 'dot-'+dotCount; 
          dot.style.backgroundColor = "#e1e1fb";
          //dot.style.borderColor = "yellow";
          //dot.style.borderWidth = "1px";
          //dot.style.borderStyle = "solid";
          //dot.style.borderRadius = "50%";
          dot.style.zIndex = "102";
          dot.classList.add('pac-dot');
          dot.classList.add('pac-dot-'+j+'-'+i);
          dot.style.width = dotWidth;
          dot.style.height = dotWidth;

          dot.style.top = cellW * (i + 1) - dotWidth / 2;
          dot.style.left = cellW * (j + 1) - dotWidth / 2;

          if (board[i].charAt(j) === 'B') {
            dot.style.width = dotWidth * 4;
            dot.style.height = dotWidth * 4;
            dot.style.top = cellW * (i + 1) - dotWidth * 4 / 2;
            dot.style.left = cellW * (j + 1) - dotWidth * 4 / 2;
            dot.style.borderRadius = '50%';
            dot.classList.add('big');
  
          }

          game.appendChild(dot);   
          dotCount++;
        }

        function makeCorner(topBottom,rightLeft) {

          let cornerW = cellW / 2;
          let radial = 'radial-gradient(circle ' + cornerW + 'px at ' + rightLeft +' 100% ' + topBottom + ' 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) '+(cornerW - 3)+'px, #e33022 '+(cornerW - 3)+'px,  #e33022 100%, #f4bb9c 100%)';
          let block = document.createElement('div');
          block.style.position = "absolute";
          block.style.backgroundColor = "black";
          block.style.background = radial;
          block.style.zIndex = "100";
          block.style.width = cornerW;
          block.style.height = cornerW;
          block.style.top = topBottom === 'top' ? (cellW * i - 3) + 'px' : (cellW * (i + 1) - cornerW + 3) + 'px';
          block.style.left = rightLeft === 'left' ? (cellW * j - 3) + 'px' : (cellW * (j + 1) - cornerW + 3) + 'px';
          return block;
        }

        // Adds rounding to the corners as needed

        for (const c in corners) {

          if (corners[c] === 'wall') {
            let topBottom = c.substr(0,c.search(/[LR]/)).replace('border','').toLowerCase();
            let rightLeft = c.substr(c.search(/[LR]/)).toLowerCase();

            let thisCorner = makeCorner(topBottom,rightLeft);
            game.appendChild(thisCorner);

          }

        }

      } 

    }

  })

  // Make the 'ready' div

  let readyDiv = document.createElement('div');
  readyDiv.id = 'ready';
  readyDiv.style.position = 'absolute';
  readyDiv.style.zIndex = 50;
  readyDiv.style.backgroundColor = 'none';
  readyDiv.style.top = cellW * (ghostStartRow + 4);
  readyDiv.style.left = cellW * ghostStartCol;
  readyDiv.style.height = cellW * 2;
  readyDiv.style.width = cellW * 7;
  readyDiv.style.padding = cellW / 4;
  readyDiv.style.fontFamily = '\'Press Start 2P\',cursive';
  readyDiv.style.fontSize = '2rem';
  readyDiv.style.color = 'yellow';
  readyDiv.style.textAlign = 'center';
  readyDiv.style.alignContent = 'center';
  readyDiv.innerHTML = 'READY!';

  game.appendChild(readyDiv);

  // Make the ghost div

  let block = document.createElement('div');
  block.style.position = 'absolute';
  block.style.zIndex = 50;
  block.style.backgroundColor = '#f1bdae';
  block.style.top = cellW * ghostStartRow;
  block.style.left = cellW * ghostStartCol;
  block.style.height = cellW * 4;
  block.style.width = cellW * 7;
  block.style.border = "solid 3px #e33022"

  let innerDiv = document.createElement('div');
  innerDiv.style.position = "absolute";
  innerDiv.style.zIndex = 51;
  innerDiv.style.backgroundColor = "black";
  innerDiv.style.top = cellW / 3 - 3;
  innerDiv.style.left = cellW / 3 - 3;
  innerDiv.style.height = cellW * 4 - (cellW * 2/ 3);
  innerDiv.style.width = cellW * 7 - (cellW * 2 / 3);
  innerDiv.style.border = "solid 3px #e33022";

  let door = document.createElement('div');
  door.style.position = "absolute";
  door.style.zIndex = 52;
  door.style.backgroundColor = "#e1e1fb";
  door.style.top = -3;
  door.style.left = cellW * 2 + cellW / 4;
  door.style.height = cellW / 3 + 3;
  door.style.width = cellW * 2 + 3;
  door.style.borderLeft = "solid 3px #e33022";
  door.style.borderRight = "solid 3px #e33022";
  door.style.borderTop = "solid 3px black";
  door.style.borderBottom = "solid 3px black";

  block.appendChild(innerDiv);
  block.appendChild(door);

  game.appendChild(block);

  function makeGhost(pos,gColor,eyepos,id,free) {

    pos['rowM'] = pos.row + 1;
    pos['colM'] = pos.col + 1;

    const fringeW = Math.floor(cellW * 1.5 / 12);

    const ghostDiv = document.createElement('div');
    ghostDiv.id = id;
    ghostDiv.style.backgroundColor = gColor;
    ghostDiv.style.backgroundSize = '100%';
    ghostDiv.style.backgroundImage = 'none';
    ghostDiv.style.position = 'absolute';
    ghostDiv.style.zIndex = 900;
    ghostDiv.style.height = cellW * 1.5 - fringeW * 2;
    ghostDiv.style.width = cellW * 1.5;
    ghostDiv.style.borderTopLeftRadius = '50%';
    ghostDiv.style.borderTopRightRadius = '50%';
    ghostDiv.style.margin = (cellW / 4) + 'px'
    ghostDiv.style.top = cellW * (pos.row);
    ghostDiv.style.left = cellW * (pos.col) - cellW / 2;

    const createGhostDivChild = (height, width, margin, top, left, bgcolor, bgimage, borderCorners) => {
      const item = document.createElement('div');
      item.style.backgroundColor = bgcolor;
      item.style.backgroundImage = bgimage;
      item.style.position = 'absolute';
      item.style.height = height;
      item.style.width = width;
      item.style.borderTopRightRadius = borderCorners[0];
      item.style.borderBottomRightRadius = borderCorners[1];
      item.style.borderBottomLeftRadius = borderCorners[2];
      item.style.borderTopLeftRadius = borderCorners[3];
      item.style.margin = margin;
      item.style.top = top;
      item.style.left = left;
      return item;
    }

    let eyetop = '';
    let eyeleft = '';
    let pupiltop = '';
    let pupilleft = '';
    if (eyepos === 'L') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 2.5) + 'px';
      pupilleft = (fringeW * 2) + 'px';
    }
    else if (eyepos === 'U') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2.5) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 0.5) + 'px';
      pupilleft = (fringeW * 3) + 'px';
    }
    else if (eyepos === 'D') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2.5) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 2.5) + 'px';
      pupilleft = (fringeW * 3) + 'px';
    }

    let ghostDivArr = [];
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': '0px', 'bgcolor' : gColor, 'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '0%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': fringeW + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(circle at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 3) + 'px', 
                      'bgcolor' : gColor, 
                      'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': cellW * 1.5 - fringeW * 10, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 5) + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(ellipse at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 5 + cellW * 1.5 - fringeW * 10) + 'px', 
                      'bgcolor' : gColor, 
                      'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 7 + cellW * 1.5 - fringeW * 10) + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(circle at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': ((cellW/4) + cellW * 1.5 - fringeW * 3) + 'px', 
                      'bgcolor' : gColor, 'bgimage' : 'none',
                      'borderCorners' : ['0%', '0%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 4, 'width': fringeW * 3, 
                      'margin' : '0px', 'top' : eyetop, 
                      'left': eyeleft, 
                      'bgcolor' : 'white', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 4, 'width': fringeW * 3, 
                      'margin' : '0px', 'top' : eyetop, 
                      'left': (fringeW * 5 + parseInt(eyeleft)) + 'px', 
                      'bgcolor' : 'white', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : pupiltop, 
                      'left': pupilleft, 
                      'bgcolor' : 'blue', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : pupiltop, 
                      'left': (fringeW * 5 + parseInt(pupilleft)) + 'px', 
                      'bgcolor' : 'blue', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
                        

    ghostDivArr.forEach(x => {

      let tempDiv = createGhostDivChild(x.height, x.width, x.margin,x.top,x.left,x.bgcolor,x.bgimage,x.borderCorners);
      ghostDiv.appendChild(tempDiv);

    })

    let game = document.getElementById('game');
    game.appendChild(ghostDiv);
    return {'item': ghostDiv, 'cache':'', 'speed': -speed / 2, 'direction' : 'left', 'free' : free, 'rcPos' : pos, 'position':{'x': (cellW * (pos.col) - cellW / 2),'y': cellW * (pos.row)}};

  }

  ghosts.push(makeGhost({'row':11,'col':14},'red','L','inky',true));
  ghosts.push(makeGhost({'row':14,'col':12},'aqua','U','blinky',false));
  ghosts.push(makeGhost({'row':14,'col':14},'plum','D','pinky',false));
  ghosts.push(makeGhost({'row':14,'col':16},'orange','U','clyde',false));

}

console.log(ghosts);

// Make a pacMan
//const makeOne = () => pacMen.push(makePac())

// Deprioritize a button after it has been clicked
const buttonSwap = () => {

  let start = document.getElementById('start');
  if (start.style.display.includes('none')) { start.style.display = ''; } 
  else { start.style.display = 'none'; }

  let stop = document.getElementById('stop');
  if (stop.style.display.includes('none')) { stop.style.display = ''; } 
  else { stop.style.display = 'none'; }
}

const findXY = rcPos => {

  let x = rcPos.col * cellW;
  let y = rcPos.row * cellW;

  return {x, y};

}

let msPacMan = {}; 
window.onload = (event) => {
  drawBoard(board);
  msPacMan = makePac();

}


// Make a PacMan 
function makePac() {
  
  let direction = 'right';
  let position = findXY(pacPos);

  // Add image to div id = game
  let game = document.getElementById('game');
  let newimg = document.createElement('img');
  newimg.style.position = 'absolute';
  newimg.style.zIndex = '200';
  newimg.src = './images/mspacman1.png';
  newimg.style.transform = 'rotate(0deg)';
  let topPad = Math.floor((cellW * 2 - pacWidth) / 2);
  let rightPad = Math.floor((cellW * 2 - pacWidth) / 2);
  newimg.style.margin = topPad + "px " + rightPad + "px " + topPad + "px " + rightPad + "px";
  newimg.width = pacWidth;

  // Set position
  newimg.style.left = position.x - cellW / 2;
  newimg.style.top = position.y;

  game.appendChild(newimg);

  // return details in an object
  return {
    position,
    speed,
    direction,
    newimg,
    'rcPos' : pacPos,
    'cache' : ''
  };
}

function nextPos(pos,dir) {

  if (dir === '') {return pos;}

  let next = {'col':pos.col,'colM': pos.col + 1,'row':pos.row, 'rowM':pos.row + 1};
  next.row += dir === 'down' ? 1 : dir === 'up' ? -1 : 0
  next.rowM += dir === 'down' ? 1 : dir === 'up' ? -1 : 0
  next.col += dir === 'right' ? 1 : dir === 'left' ? -1 : 0
  next.colM += dir === 'right' ? 1 : dir === 'left' ? -1 : 0
  
  return next;

}

function isWall(pos,dir) {

  let res1 = board[pos.row].charAt(pos.col);
  let res2 = board[pos.rowM].charAt(pos.colM);

  if (dir === 'right') {
    res1 = board[pos.row].charAt(pos.colM);
    res2 = board[pos.rowM].charAt(pos.colM);  
  }
  if (dir === 'down') {
    res1 = board[pos.rowM].charAt(pos.col);
    res2 = board[pos.rowM].charAt(pos.colM);  
  }
  if (dir === 'left') {
    res1 = board[pos.row].charAt(pos.col);
    res2 = board[pos.rowM].charAt(pos.col);  
  }
  if (dir === 'up') {
    res1 = board[pos.row].charAt(pos.col);
    res2 = board[pos.row].charAt(pos.colM);  
  }

  if (res1.search(/[XG]/) > -1 || res2.search(/[XG]/) > -1) {return true;} else {return false;}

}

function isEmpty(pos) {

  let res = board[pos.row][pos.col];
  return (res === 'S' || res === 'P');

}


// Update the position of Ms PacMan
function update() {

  count++;

  if (stop === false) {

    document.onkeydown = checkKey;

    function checkKey(e) {
    
        e = e || window.event;
        if (e.keyCode == '38' || e.keyCode == '87') { msPacMan.cache = 'up'; } 
        else if (e.keyCode == '40' || e.keyCode == '83') { msPacMan.cache = 'down'; } 
        else if (e.keyCode == '37' || e.keyCode == '65') { msPacMan.cache = 'left'; } 
        else if (e.keyCode == '39' || e.keyCode == '68') { msPacMan.cache = 'right'; }
    
    }
  
    if (msPacMan.speed !== 0 || msPacMan.cache !== '') {
  
      checkCollisions(msPacMan);

      checkDots(msPacMan);
  
      if (msPacMan.direction === 'left' || msPacMan.direction === 'right' ) {
          msPacMan.position.x += msPacMan.speed;
          msPacMan.newimg.style.left = msPacMan.position.x;
      } else if (msPacMan.direction === 'up' || msPacMan.direction === 'down' ){
          msPacMan.position.y += msPacMan.speed;
          msPacMan.newimg.style.top = msPacMan.position.y;
      }
  
      msPacMan.rcPos.row = Math.floor(msPacMan.position.y / cellW);
      msPacMan.rcPos.rowM = Math.floor(msPacMan.position.y / cellW) + 1;
      msPacMan.rcPos.col = Math.floor(msPacMan.position.x / cellW);
      msPacMan.rcPos.colM = Math.floor(msPacMan.position.x / cellW) + 1;
    }

  }

  if (count === 3) {
      msPacMan.newimg.src = msPacMan.newimg.src.includes('mspacman1.png') ? 
                        './images/mspacman2.png' : './images/mspacman1.png'  
    }

  if (count === 3) count = 0

  setTimeout(update, 50);

}

// Update the position of free ghosts
function updateGhosts() {

  if (stop === false) {

    ghosts.forEach(ghost=> {

      if(ghost.free === true) {
  
        // stuff to do if the ghost can move

        // check collisions in the direction he is moving
        checkCollisions(ghost);


        if (ghost.cache === '') {

          let cacheC  = 0;
          while (ghost.cache === '' && cacheC < 200) {
            cacheC++;
            console.log(cacheC);
            console.log(ghost.direction);
            let randomDir = Math.floor(Math.random() * 3.9);
            let dirArr = ['up','down','left','right'];
            let cacheDir = dirArr[randomDir];
            if (isWall(nextPos(ghost.rcPos,cacheDir),cacheDir) === false && cacheDir !== ghost.direction) {
              if (cacheDir === 'left' && ghost.direction !== 'right') {ghost.cache = cacheDir;}
              else if (cacheDir === 'right' && ghost.direction !== 'left') {ghost.cache = cacheDir;}
              else if (cacheDir === 'up' && ghost.direction !== 'down') {ghost.cache = cacheDir;}
              else if (cacheDir === 'down' && ghost.direction !== 'up') {ghost.cache = cacheDir;}
            }
          }       

        }

        //if (ghost.speed === 0) {
        //  while (ghost.speed === 0 && speedC < 300) {
        //    speedC++;
        //    let randomDir = Math.floor(Math.random() * 3.9);
        //    let dirArr = ['up','down','left','right'];
        //    let speedArr = [-speed / 2, speed / 2, -speed / 2, speed / 2];
        //    if (isWall(nextPos(ghost.rcPos,dirArr[randomDir]),dirArr[randomDir]) === false) {
        //      ghost.speed = speedArr[randomDir];
        //      ghost.direction = dirArr[randomDir];
        //      ghost.cache = '';
        //    }
        //  }
        //}


        // move him

        if (ghost.direction === 'left' || ghost.direction === 'right' ) {
          ghost.position.x += ghost.speed;
          ghost.item.style.left = ghost.position.x;
        } else if (ghost.direction === 'up' || ghost.direction === 'down' ){
            ghost.position.y += ghost.speed;
            ghost.item.style.top = ghost.position.y;
        }

          ghost.rcPos.row = Math.floor(ghost.position.y / cellW);
          ghost.rcPos.rowM = Math.floor(ghost.position.y / cellW) + 1;
          ghost.rcPos.col = Math.floor(ghost.position.x / cellW);
          ghost.rcPos.colM = Math.floor(ghost.position.x / cellW) + 1;
        
      }
  
    })

  }

  setTimeout(updateGhosts, 50);

}


function checkDots(item) {

  // find all dots in the current cell
  let classCode = 'pac-dot-'+msPacMan.rcPos.col + '-' + msPacMan.rcPos.row;
  let next = nextPos(msPacMan.rcPos,item.direction);
  let classCode2 = 'pac-dot-'+next.col + '-' + next.row;
 
  if (item.direction === 'right') {classCode2 = 'pac-dot-'+next.colM + '-' + next.row;}
  if (item.direction === 'down') {classCode2 = 'pac-dot-'+next.col + '-' + next.rowM;}

  let dots = Array.prototype.slice.call(document.getElementsByClassName(classCode), 0);
  let dots2 = Array.prototype.slice.call(document.getElementsByClassName(classCode2), 0);
 
  dots.push(...dots2);
  //dots.push(...dots3);

  // check if any are in the mouth
  for (let i = 0; i < dots.length; i++) {

    let dot = dots[i];

    let dotLeft = parseInt(dot.style.left);
    let dotRight = dotLeft + parseInt(dot.style.width);
    let dotTop = parseInt(dot.style.top);
    let dotBottom = dotTop + parseInt(dot.style.width);
    let itemLeft = parseInt(item.newimg.style.left);
    let itemTop = parseInt(item.newimg.style.top);


    let leftBoundary = itemLeft + cellW - pacWidth / 2;
    let rightBoundary = leftBoundary + pacWidth;
    let topBoundary = itemTop + cellW - pacWidth / 2;
    let bottomBoundary = topBoundary + pacWidth;

    function removeDot(id) {
      let dotToRemove = document.getElementById(id);
      let game = document.getElementById('game');
      let removedDot = game.removeChild(dotToRemove);
      if (removedDot !== '') {
        score += 100;
        let scoreDiv = document.getElementById('score');
        scoreDiv.innerHTML = score;
      }
    }

    if (dotLeft > leftBoundary && dotRight < rightBoundary && dotTop > topBoundary && dotBottom < bottomBoundary) {
      removeDot(dot.id);
    }

  }

}

// Check prosimity to edges and reverse direction and image if needed
function checkCollisions(item) {

  if (item.cache !== '') {

    // figure out the next position based on the desired direction
    let next = nextPos(item.rcPos,item.cache);

    // if there is no wall there, AND the item is at a transition point, change the direction and speed and clear the cache
    let canTurn = false;
    if (findXY(item.rcPos).x === item.position.x && findXY(item.rcPos).y === item.position.y) {canTurn = true;}

    let canReverse = false;
    if (item.cache === 'left' && item.direction === 'right') {canReverse = true;}
    if (item.cache === 'right' && item.direction === 'left') {canReverse = true;}
    if (item.cache === 'up' && item.direction === 'down') {canReverse = true;}
    if (item.cache === 'down' && item.direction === 'up') {canReverse = true;}

    if (isWall(next,item.cache) === false && (canTurn === true || canReverse === true)) {

          let stats = d[item.cache];
          let transformStr = stats.transform;

          let currDir = item.direction;

          if (item.hasOwnProperty('newimg')) {
            let currTransform = item.newimg.style.transform;
            if (item.cache === 'down' && currDir === 'left') {transformStr = "rotate(270deg) rotateY(180deg)";}
            else if (item.cache === 'down' && currDir === 'right') {transformStr = "rotate(90deg)";}
            else if (item.cache === 'up' && currDir === 'left') {transformStr = "rotate(90deg) rotateY(180deg)";}
            else if (item.cache === 'up' && currDir === 'right') {transformStr = "rotate(-90deg)";}
            else if (item.cache === 'up' && currDir === 'down') {
              if (currTransform.includes("rotate(270deg) rotateY(180deg)")) {transformStr = "rotate(270deg)";}
            }
            else if (item.cache === 'down' && currDir === 'up') {
              if (currTransform.includes("rotate(90deg) rotateY(180deg)")) {transformStr = "rotate(90deg)";}
            }
            item.newimg.style.transform = transformStr;
            item.speed = stats.speed;
          } else {item.speed = stats.speed / 2;}

          item.direction = item.cache;
          item.cache = '';

          return true;      
  
    } 
  
  }

  // if there is no cache, or it wasn't cleared, check whether Ms PacMan is up against a wall
  let next = nextPos(item.rcPos, item.direction);

  if (isWall(next,item.direction) === true && findXY(item.rcPos).x === item.position.x && findXY(item.rcPos).y === item.position.y) {
    item.speed = 0;
    item.cache = '';
  }

  if (item.position.x <= -cellW) {item.position.x = board[0].length * cellW;}
  else if (item.position.x > board[0].length * cellW) {item.position.x = -cellW;}

}
