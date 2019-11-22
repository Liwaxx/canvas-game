
function startGame (){

    gameFrame();

    gameArea.start();
    gameObj = new component(30,30,"red",10,120);

    document.getElementById('start-game').style.display = 'none';
}

function gameFrame (){
   leftEnd = new component(2 , 600 , 'red', 0 , 0 );
   rightEnd = new component(2 , 600 , 'red', 598 , 0 );

   topEnd = new component(600 , 2 , 'red', 0 , 0 );
   bottomEnd = new component(600 , 2 , 'red', 0 , 598);
}

function component (width, height, color , x , y , type) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.moveX = 0;
  this.moveY = 0;
  this.update = function (){
    ctx =  gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x , this.y , this.width , this.height);
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

function updateArea () {
  gameArea.clear();
  moveControl();
  
  
  //frame
  leftEnd.update();
  rightEnd.update();
  topEnd.update();
  bottomEnd.update();


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
    this.interval = setInterval(updateArea, 20);
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
  }
}


