
var sprites = {
  car1: {sx:8, sy:4, w:96, h:48, frames: 1},
  car2: {sx:109, sy:4, w:96, h:48, frames: 1},
  car3: {sx:213, sy:4, w:96, h:48, frames: 1},
  car4: {sx:7, sy:62, w:125, h:48, frames: 1},
  car5: {sx:148, sy:62, w:200, h:48, frames: 1},
  bg: {sx:421, sy:0, w:550, h:625, frames: 1},
  frog: {sx:0, sy:346, w:36, h:24, frames: 1},
  trunk1: {sx:9, sy:123, w:191, h:42, frames: 1},
  trunk2: {sx:9, sy:172, w:247, h:42, frames: 1},
  trunk3: {sx:270, sy:172, w:130, h:42, frames: 1},
  tortu: {sx:5, sy:288, w:49, h:48, frames: 1},
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
};
PlayerField.prototype = new Sprite();

//RANA
var Frog = function(){
  this.setup('frog', {vx: 0, vy: 0, reloadTime: 0.12});

   this.x = Game.width/2 - this.w / 2;
   this.y = Game.height - this.h;
   this.reload = 0;

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

      this.vx= 0;
      this.vy= 0;
   }
   
    this.onTrunk = function(vt){
      this.x += vt;
    };
   
     
   
}
Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;


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
var Tortu = function(dir, row, vt){
  this.setup('tortu', {dir: dir, row: row, vt: vt});
  
  //this.type hacer con esto que elija el sprite LEFT o RIGHT 
  
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
Tortu.prototype = new Sprite();
Tortu.prototype.type = OBJECT_ENEMY;

// PLAYER

var PlayerShip = function() { 

  this.setup('ship', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });

   this.x = Game.width/2 - this.w / 2;
   this.y = Game.height - 10 - this.h;

   this.reload = this.reloadTime;


   this.step = function(dt) {
     if(Game.keys['left']) { this.vx = -this.maxVel; }
     else if(Game.keys['right']) { this.vx = this.maxVel; }
     else { this.vx = 0; }

     this.x += this.vx * dt;

     if(this.x < 0) { this.x = 0; }
     else if(this.x > Game.width - this.w) { 
       this.x = Game.width - this.w 
     }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
      this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
    }

   }

}

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
}


///// EXPLOSION

var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
  this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame = Math.floor(this.subFrame++ / 3);
  if(this.subFrame >= 36) {
    this.board.remove(this);
  }
};



/// Player Missile


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2; 
  this.y = y - this.h; 
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;


PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  if(this.y < -this.h) { this.board.remove(this); }

  var collision = this.board.collide(this,OBJECT_ENEMY);
    if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) { 
      this.board.remove(this); 
  }


};



/// ENEMIES

var enemies = {
  straight: { x: 0,   y: -50, sprite: 'enemy_ship', health: 10, 
              E: 100 },
  ltr:      { x: 0,   y: -100, sprite: 'enemy_purple', health: 10, 
              B: 200, C: 1, E: 200  },
  circle:   { x: 400,   y: -50, sprite: 'enemy_circle', health: 10, 
              A: 0,  B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI/2 },
  wiggle:   { x: 100, y: -50, sprite: 'enemy_bee', health: 20, 
              B: 100, C: 4, E: 100 },
  step:     { x: 0,   y: -50, sprite: 'enemy_circle', health: 10,
              B: 300, C: 1.5, E: 60 }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0, 
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, health: 20, damage: 10 };


Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.step = function(dt) {
  this.t += dt;
  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
  this.x += this.vx * dt;
  this.y += this.vy * dt;
  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

}

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      this.board.add(new Explosion(this.x + this.w/2, 
                                   this.y + this.h/2));
    }
  }

}





/// STAR FIELD

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width; 
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set, 
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  }

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  }
}

