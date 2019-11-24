
var gameObj, myScore , myLive , topEnd , leftEnd , bottomEnd , rightEnd;
var myEnemy = [];
var myLasers = [];

function startGame (){

    gameFrame();

    gameArea.start();
    
    gameObj = new component(30,30,"red",270,530);
    myScore = new component(70 , 50 , "black" , 40 ,20, 'text');
    myLive = new component(70 , 50 , "black" , 40, 40 , 'text');


    document.getElementById('start-game').style.display = 'none';
}

function gameRestart (){
  gameArea.restart();
  document.getElementById('you-win').style.display ='none';
  document.getElementById('game-over').style.display ='none';
  updateArea();
}

function gameFrame (){
   leftEnd = new component(2 , 600 , 'red', 0 , 0 );
   rightEnd = new component(2 , 600 , 'red', 598 , 0 );

   topEnd = new component(600 , 2 , 'red', 0 , 0 );
   bottomEnd = new component(600 , 2 , 'red', 0 , 598);
}

function component (width, height, color , x , y , type) {

  if(type == 'image'){
    this.image = new Image();
    this.image.src = this.color;
  }

  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.moveX = 0;
  this.moveY = 0;


  this.update = function (){
    ctx =  gameArea.context;

    if(type == 'image'){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    else if (type == 'text'){
      ctx.fillStyle = color;
      ctx.fillText(this.text , this.x, this.y);
    }
    else{
      ctx.fillStyle = color;
      ctx.fillRect(this.x , this.y , this.width , this.height);
    }
  }
  this.newPos = function(){
    this.x += this.moveX;
    this.y += this.moveY;
  }
  this.crashWith = function (obj) {
    myLeft = this.x;
    myTop = this.y;
    myRight = this.x + this.width;
    myBottom = this.y + this.height;

    objLeft = obj.x;
    objTop = obj.y;
    objRight = obj.x + obj.width;
    objBottom = obj.y + obj.height;

    var crash = true;

    if(myLeft > objRight || myTop > objBottom || myRight < objLeft || myBottom < objTop){
      crash = false;
    }
    return crash;
  }
}

function shooting (){
  if(gameArea.keys && gameArea.keys[32] && gameArea.ammo > 0){
    myLasers.push(new component(4,20,'green',(gameObj.x + 15),gameObj.y));
    gameArea.keys[32] = false;
    gameArea.ammo -= 1;
  }


  for(x=0 ; x < myLasers.length; x++){
    myLasers[x].y -= 5;
    myLasers[x].update()
    if(myLasers[x].crashWith(topEnd)){
      myLasers[x] = new component(0,0,'black',-10,-10);
      gameArea.ammo += 1;
    }
  }
}

function moveControl () {
  if(gameObj.crashWith(leftEnd)){
    gameArea.keys[37] = false;
  }
  if(gameObj.crashWith(topEnd)){
    gameArea.keys[38] = false;
  }
  if(gameObj.crashWith(rightEnd)){
    gameArea.keys[39] = false;
  }
  if(gameObj.crashWith(bottomEnd)){
    gameArea.keys[40] = false;
  }

  gameObj.moveX = 0;
  gameObj.moveY =0;

  if(gameArea.keys && gameArea.keys[37]){
     gameObj.moveX = -4
  }
  if(gameArea.keys && gameArea.keys[38]){
    gameObj.moveY = -4
  }
  if(gameArea.keys && gameArea.keys[39]){
    gameObj.moveX = 4
  }
  if(gameArea.keys && gameArea.keys[40]){
    gameObj.moveY = 4
  }
}

function eventInterval (n) {
  if((gameArea.frameNumber / n) % 1 === 0){
    return true;
  }
  return false;
}

function updateArea () {
  //enemy
  for(x=0 ; x < myEnemy.length ;  x++){
    if(gameObj.crashWith(myEnemy[x])){
      gameArea.live -= 1;
      if(gameArea.live == 0){
        gameArea.stop();
        document.getElementById('game-over').style.display ='block';
      }else{
        gameArea.reset();
      }
    }
  }

  //menang
  if(gameArea.score == 50){
    gameArea.stop();
    document.getElementById('you-win').style.display ='block';
  }

  gameArea.clear();

  //firstGo
  if(gameArea.firstGo == 1){
    myEnemy.push(new component(30,30,"blue",50 , 30));
    myEnemy.push(new component(30,30,"blue",155 , 30));
    myEnemy.push(new component(30,30,"blue",270 , 30));
    myEnemy.push(new component(30,30,"blue",390 , 30));
    myEnemy.push(new component(30,30,"blue",510 , 30));
  }

  gameArea.firstGo = 2;

  //random enemy
  gameArea.frameNumber += 1;

  if(eventInterval(70)){
    var newX = Math.floor(Math.random() * (500 - 40) + 40);
    myEnemy.push(new component(30,30,"blue", newX , 30));
  }

  for(i = 0 ; i < myEnemy.length ; i++){
    myEnemy[i].y += 3;
    myEnemy[i].update();
    for(z = 0 ; z < myLasers.length; z++){
      if(myLasers[z].crashWith(myEnemy[i])){
        myLasers[z] = new component(0,0,'black',-10,-10);
        myEnemy[i] =new component(0,0,'black',-10,-10);
        gameArea.score +=10;
        gameArea.ammo +=1;
      }
    }
  }

  //shooting update
  shooting();

  moveControl();
  
  
  //frame
  leftEnd.update();
  rightEnd.update();
  topEnd.update();
  bottomEnd.update();

  //score live
  myLive.text = "LIVE = "+gameArea.live;
  myScore.text = "SCORE = "+gameArea.score;
  myLive.update();
  myScore.update();

  //caracter
  gameObj.update();
  gameObj.newPos();

}

var gameArea = {
  canvas : document.createElement('canvas'),

  start : function(){
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas , document.body.childNodes[0]);

    this.firstGo = 1;
    this.frameNumber = 0;
    this.interval = setInterval(updateArea, 20);

    this.live = 3;
    this.score = 0;
    this.ammo = 3;

    window.addEventListener('keydown', function (e){
      gameArea.keys = (gameArea.keys || []);
      gameArea.keys[e.keyCode] = true
    })
    window.addEventListener('keyup', function (e){
      gameArea.keys[e.keyCode] = false;
    })
  },
  clear : function (){
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
  stop : function (){
    clearInterval(this.interval);
  },
  reset : function(){
    myEnemy = [];
    myLasers = [];
    this.firstGo = 1;
    this.ammo = 3;
    this.frameNumber = 0;
    gameObj = new component(30,30,"red",270,530);
  },
  restart : function(){
    this.live = 3;
    this.score = 0;
    this.frameNumber = 0;
    this.ammo = 3;
    this.firstGo = 1;
    myEnemy = [];
    myLasers =[];
    gameObj = new component(30,30,"red",270,530);
    this.interval = setInterval(updateArea, 20);
  }
}


