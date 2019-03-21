
var sprites = {
  car1: {sx:8, sy:4, w:96, h:48, frames: 1},
  car2: {sx:109, sy:4, w:96, h:48, frames: 1},
  car3: {sx:213, sy:4, w:96, h:48, frames: 1},
  car4: {sx:7, sy:62, w:125, h:48, frames: 1},
  car5: {sx:148, sy:62, w:200, h:48, frames: 1},
  bg: {sx:421, sy:0, w:550, h:624, frames: 1},
  frog: {sx:0, sy:346, w:36, h:24, frames: 1},
  trunk1: {sx:9, sy:123, w:191, h:42, frames: 1},
  trunk2: {sx:9, sy:172, w:247, h:42, frames: 1},
  trunk3: {sx:270, sy:172, w:130, h:42, frames: 1},
  tortu: {sx:5, sy:288, w:48, h:48, frames: 1},
  death: {sx:211, sy:128, w:48, h:36, frames: 4},
  title: {sx:7, sy:395, w:262, h:165, frames: 1},

};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16,
    LEFT = 0,
    RIGHT = 1;



/// CLASE PADRE SPRITE
var Sprite = function()  
 { }

Sprite.prototype.setup = function(sprite,props) {
  this.sprite = sprite;
  this.merge(props);
  this.frame = this.frame || 0;
  this.w =  SpriteSheet.map[sprite].w;
  this.h =  SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
  if(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    }
  }
}
Sprite.prototype.draw = function(ctx) {
  SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

Sprite.prototype.hit = function(damage) {
  this.board.remove(this);
}

//ESCENARIO 
var PlayerField = function(){
  this.setup('bg', {x:0, y:0});
  this.w = Game.width;
  this.h = Game.height;

  this.step = function(dt) {
  };
}
PlayerField.prototype = new Sprite();


//WELCOME
var Welcome = function() {
  this.setup('title',{x:140, y:200});

  //this.w = Game.width/2 - this.w/3;
  //this.h = Game.height/2 - this.h + 40;
  this.step = function(dt) {
  };
};
Welcome.prototype = new Sprite();





//RANA
var Frog = function(){
  this.setup('frog', {vx: 0, vy: 0, reloadTime: 0.12});

   this.x = Game.width/2 - this.w / 2;
   this.y = Game.height - this.h;
   this.reload = 0;
   this.overTrunk = false;

   this.step = function(dt){
     this.reload+=dt;

      //MOVIMIENTOS
      if(Game.keys['left']) { this.vx = -this.w; }
       else if(Game.keys['right']) { this.vx = this.w; }
       else if(Game.keys['up']) { this.vy = -this.h; }
       else if(Game.keys['down']) { this.vy = this.h; }

    
        if (this.reload > this.reloadTime){
          this.reload = 0;
          this.x+=this.vx;
          this.y+=this.vy;
        }
        

      //LIMITES
     if(this.x < 0) { this.x = 0; }
        else if(this.x > Game.width-this.w/2)
          this.x = Game.width-this.w/2;

     if(this.y < 0) { this.y = 0; }
        else if (this.y > Game.height - this.h)
          this.y = Game.height - this.h;

      //resets 
      this.vx= 0;
      this.vy= 0;
      this.overTrunk = false; //a partir del 2do tronco
   }
   

    this.onTrunk = function(vt){
      this.x += vt;
      this.overTrunk = true;
    }

    this.onWater = function(damage){
      if(!this.overTrunk){this.hit(damage);}  
    }

    this.hit = function(damage) {
      if(this.board.remove(this)){
        var deathFrog = new Death(this.x, this.y);
        this.board.add(deathFrog);
        loseGame();
      }
    }
   
}
Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;



//Muerte

var Death = function(x,y){
  this.setup('death', { frame: 0 });
  this.x = x;
  this.y = y;
  this.step = function(dt){
    this.frame++;
    if(this.frame >= 4) {
      this.board.remove(this);
    }
  }

}
Death.prototype = new Sprite();


//CAR

var Car = function(type, dir, row, speed){

  this.setup(type, {type: type, dir: dir, row: row, speed: speed});
  
  if(this.dir == RIGHT){this.x = Game.width;} 
  else {this.x = -this.w} //Game width xq si no se corta el principio

  //48 altura max 
  this.y = (Game.height - this.h) - row * 48;

  this.step = function(dt){
    //MOVIMIENTO
    if(this.dir == RIGHT){this.x -= this.speed;}
    else{ this.x += this.speed;}

    //COLISION	    
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
      collision.hit(this.damage);
    }

    //LIMITE
    if((this.x + this.w) < 0) { 
      this.board.remove(this);
    } else if((this.x - this.w) > Game.width - this.w){
      this.board.remove(this);
    }


  }


}
Car.prototype = new Sprite();
Car.prototype.type = OBJECT_ENEMY;

//TRONCO
var Trunk = function(type, dir, row, vt){
  this.setup(type, {type: type, dir: dir, row: row, vt: vt});
  
  if(this.dir == RIGHT){this.x = Game.width;}
  else {this.x = -this.w} 

  //48 altura max 
  this.y = (Game.height - this.h) - row * 48;

  this.step = function(dt){
    //MOVIMIENTO
    if(this.dir == RIGHT){this.x -= this.vt;}
    else{ this.x += this.vt;}

    //COLISION
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {
		if(this.dir == RIGHT){
			collision.onTrunk(-this.vt);
		}
		else {collision.onTrunk(this.vt);}
		
    }

    //LIMITE
    if((this.x + this.w) < 0) { 
      this.board.remove(this);
    } else if((this.x - this.w) > Game.width - this.w){
      this.board.remove(this);
    }


  }

}
Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_ENEMY;

//TORTUGA
var Tortu = function(row, vt){
  this.setup('tortu', {row: row, vt: vt});
  
  this.x = -this.w

  //48 altura max 
  this.y = (Game.height - this.h) - row * 48;

  this.step = function(dt){
    //MOVIMIENTO
    this.x += this.vt;

    //COLISION
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision) {collision.onTrunk(this.vt);}

    //LIMITE
    if((this.x + this.w) < 0) { 
      this.board.remove(this);
    } else if((this.x - this.w) > Game.width - this.w){
      this.board.remove(this);
    }


  }

}
Tortu.prototype = new Sprite();
Tortu.prototype.type = OBJECT_ENEMY;



//WATER
var Water = function(){
  
  this.x = 0;
  this.y = 48;
  this.w = Game.width;
  this.h = (Game.height-48)/2-48;
  

  this.step = function(dt){
    //COLISION      
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision){
      collision.onWater(this.damage);
    }
  }

  //Invisible
  this.draw = function(ctx){};

  //AZUL PARA COMPROBAR TAMAÑO
  /*this.draw = function(ctx){
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x,this.y,this.w,this.h);
  };*/
  
}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_ENEMY;


//WIN
var Home = function(){
  
  this.x = 0;
  this.y = 0;
  this.w = Game.width;
  this.h = 48;
  

  this.step = function(dt){
    //goal      
    var collision = this.board.collide(this,OBJECT_PLAYER);
    if(collision){
      setTimeout(winGame, 900); 
    }
  }

  //Invisible
  this.draw = function(ctx){};
  
}
Home.prototype = new Sprite();
Home.prototype.type = OBJECT_ENEMY;


