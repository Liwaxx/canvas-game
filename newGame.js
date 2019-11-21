function startGame (){
    gameArea.start();

    gameObj = new component(30,30,"red",10,120);

    document.getElementById('start-game').style.display = 'none';
}

function component (width, height, color , x , y , type) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  ctx =  gameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x , this.y , this.width , this.height);
}

var gameArea = {
  canvas : document.createElement('canvas'),
  start : function(){
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas , document.body.childNodes[0]);
  }
}

