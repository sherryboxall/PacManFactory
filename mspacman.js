let count = 0;
let gCount = 0;
let stop = false;
let started = false;
let score = 0;

let d = {'left' : {'transform' : 'rotateY(180deg)','speed' : -speed,'row':0,'col':-1},
         'right' : {'transform' : 'rotate(0deg)','speed' : speed,'row':0,'col':1},
         'up' : {'transform' : 'rotate(90deg) rotateY(180deg)','speed' : -speed,'row':-1,'col':0},
         'down' : {'transform' : 'rotate(90deg)','speed' : speed,'row':1,'col':0}}


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

// Deprioritize a button after it has been clicked
const buttonSwap = () => {

  let start = document.getElementById('start');
  if (start.style.display.includes('none')) { start.style.display = ''; } 
  else { start.style.display = 'none'; }

  let stop = document.getElementById('stop');
  if (stop.style.display.includes('none')) { stop.style.display = ''; } 
  else { stop.style.display = 'none'; }
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

  // correct starting position if applicable

  ghosts.forEach(ghost=> {

    if (ghost.free === true) {

      if (ghost.position.x % ghost.speed > 0) {ghost.position.x = ghost.position.x + ghost.position.x % ghost.speed;}
      if (ghost.position.y % ghost.speed > 0) {ghost.position.y = ghost.position.y + ghost.position.y % ghost.speed;}

    }

  })

  if (stop === false) {

    ghosts.forEach(ghost=> {

      if(ghost.free === true) {
  
        // stuff to do if the ghost can move

        // check collisions in the direction he is moving
        checkCollisions(ghost);


        if (ghost.cache === '' && speed !== 0) {

          let setCache = false;
          if (msPacMan.rcPos.row < ghost.rcPos.row && ghost.direction === 'down') {setCache = true;}
          if (msPacMan.rcPos.row > ghost.rcPos.row && ghost.direction === 'up') {setCache = true;}
          if (msPacMan.rcPos.col < ghost.rcPos.col && ghost.direction === 'right') {setCache = true;}
          if (msPacMan.rcPos.col > ghost.rcPos.col && ghost.direction === 'left') {setCache = true;}
          if (Math.abs(msPacMan.rcPos.row - ghost.rcPos.row) <= 3 && Math.abs(msPacMan.rcPos.col - ghost.rcPos.col) <= 3) {setCache = false;}

          if (setCache === true) {

            let dirArr = ['left','right','up','down'];
            if (ghost.direction === 'left' || ghost.direction === 'right') {
              dirArr.splice(0,2);
              if (msPacMan.rcPos.row < ghost.rcPos.row) { ghost.cache = 'up'; }
              else if (msPacMan.rcPos.row > ghost.rcPos.row) { ghost.cache = 'down'; }
              else if (msPacMan.rcPos.col < ghost.rcPos.col && ghost.direction === 'left') {ghost.cache = 'right';}
              else if (msPacMan.rcPos.col > ghost.rcPos.col && ghost.direction === 'right') {ghost.cache = 'left';}
            }
            if (ghost.direction === 'up' || ghost.direction === 'down') {
              dirArr.splice(2,2);
              if (msPacMan.rcPos.col < ghost.rcPos.col) { ghost.cache = 'left'; }
              else if (msPacMan.rcPos.col > ghost.rcPos.col) { ghost.cache = 'right';}
              else if (msPacMan.rcPos.row < ghost.rcPos.row && ghost.direction === 'up') {ghost.cache = 'down';}
              else if (msPacMan.rcPos.row > ghost.rcPos.row && ghost.direction === 'down') {ghost.cache = 'up';}
            }
  
            if (ghost.cache === '') {
              if (ghost.direction === 'left' || ghost.direction === 'right') {
                if (Math.random() < 0.5) {ghost.cache = 'up';}
                else {ghost.cache = 'down';}
              }
              if (ghost.direction === 'up' || ghost.direction === 'down') {
                if (Math.random() < 0.5) {ghost.cache = 'left';}
                else {ghost.cache = 'right';}
              }

            }

          }
          
        }

        if (ghost.speed === 0) {

          let dirArr = ['up','down','left','right'].filter(x => x !== ghost.direction);
          dirArr = dirArr.filter(dir => {
            if (isWall(nextPos(ghost.rcPos,dir),dir) === false) {return true;} else {return false;}
          })

          let maxDist = '';
          let rowDist = msPacMan.rcPos.row - ghost.rcPos.row;
          let colDist = msPacMan.rcPos.col - ghost.rcPos.col;

          dirArr.forEach(dir => {

            if (dir === 'up' && rowDist < 0 && Math.abs(rowDist) < board.length / 2 ) {
              if ( maxDist === '' || Math.abs(rowDist) / board.length > maxDist ) {
                maxDist = Math.abs(rowDist) / board.length;
                ghost.direction = dir;
                ghost.speed = d[dir].speed;
                ghost.cache = '';
              }
            }
            else if (dir === 'down' && rowDist > 0 && Math.abs(rowDist) < board.length / 2 ) {
              if ( maxDist === '' || Math.abs(rowDist) / board.length > maxDist ) {
                maxDist = Math.abs(rowDist) / board.length;
                ghost.direction = dir;
                ghost.speed = d[dir].speed;
                ghost.cache = '';
              }
            }
            else if (dir === 'left' && colDist < 0 && Math.abs(colDist) < board[0].length / 2 ) {
              if ( maxDist === '' || Math.abs(colDist) / board[0].length < maxDist ) {
                maxDist = Math.abs(colDist) / board[0].length;
                ghost.direction = dir;
                ghost.speed = d[dir].speed;
                ghost.cache = '';
              }
            }
            else if (dir === 'right' && colDist > 0 && Math.abs(colDist) < board[0].length / 2 ) {
              if ( maxDist === '' || Math.abs(colDist) / board[0].length < maxDist ) {
                maxDist = Math.abs(colDist) / board[0].length;
                ghost.direction = dir;
                ghost.speed = d[dir].speed;
                ghost.cache = '';
              }
            }

          })

          if (ghost.speed === 0) {
            let randomDir = Math.floor(Math.random() * dirArr.length);
            let nextDir = dirArr[randomDir];
            ghost.speed = d[nextDir].speed;
            ghost.direction = nextDir;
            ghost.cache = '';

          }

        }

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
  let classCode = 'pac-dot-'+item.rcPos.col + '-' + item.rcPos.row;
  let next = nextPos(item.rcPos,item.direction);
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
        if (removedDot.classList.contains('big')) {
          score += 50;
        }
        else {score += 10;}
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

    if (isWall(next, item.cache) === false && (canTurn === true || canReverse === true)) {

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
            item.direction = item.cache;
            item.cache = '';
          } else { 

            // for ghosts, check available directions again and see if one would now be better

            let dirArr = ['up','down','left','right'];
            dirArr.splice(dirArr.indexOf(item.direction),1);
            console.log('b - ' + JSON.stringify(dirArr));
            dirArr = dirArr.filter(dir => {
              if (isWall(nextPos(item.rcPos,dir),dir) === true) {return false;} else {return true;}
            })
            console.log('a - ' + JSON.stringify(dirArr));
            let maxDist = '';
            let rowDist = msPacMan.row - item.rcPos.row;
            let colDist = msPacMan.col - item.rcPos.col;

            dirArr.forEach(dir => {

              if (dir === 'up' && rowDist <= 0) {
                if (maxDist === '' || Math.abs(rowDist) / board.length > maxDist) {
                  maxDist = Math.abs(rowDist) / board.length;
                  item.cache = 'up';
                }
              }
              if (dir === 'down' && rowDist > 0) {
                if (maxDist === '' || Math.abs(rowDist) / board.length < maxDist) {
                  maxDist = Math.abs(rowDist) / board.length;
                  item.cache = 'down';
                }
              }
              if (dir === 'left' && colDist <= 0) {
                if (maxDist === '' || Math.abs(colDist) / board[0].length < maxDist) {
                  maxDist = Math.abs(colDist) / board[0].length ;
                  item.cache = 'left';
                }
              }
              if (dir === 'right' && colDist > 0) {
                if (maxDist === '' || Math.abs(colDist) / board[0].length < maxDist) {
                  maxDist = Math.abs(colDist) / board[0].length ;
                  item.cache = 'right';
                }
              }
            })

            item.direction = item.cache;
            item.speed = d[item.cache].speed; 
            item.cache = '';

          }

          return true;      
  
    } 
  
  }

  // if there is no cache, or it wasn't cleared, check whether Ms PacMan is up against a wall
  let next = nextPos(item.rcPos, item.direction);

  if (isWall(next,item.direction) === true && findXY(item.rcPos).x === item.position.x && findXY(item.rcPos).y === item.position.y) {
    item.speed = 0;
    item.cache = '';
  }

  if (item.position.x <= 0) {
    item.position.x = (board[0].length - 2) * cellW;
    item.rcPos.col = board[0].length - 2;
    item.rcPos.colM = board[0].length - 1;
  }
  else if (item.position.x > (board[0].length - 2) * cellW) {
    item.position.x = 0;
    item.rcPos.col = 0;
    item.rcPos.colM = 1;
  }

}
