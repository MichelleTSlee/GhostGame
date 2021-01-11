
function start(){
  console.log("Starting");
  hideElements();
  game();
}

function hideElements(){
  document.getElementById('welcome').classList.add('hide');
  document.getElementById('button').classList.add('hide');
}

function game (){
//Variables
  var player = {
  x:50,
  y:100,
  spritex:0,
  spritey: 0,
  speed: 5,
  fury: false
}

var enemy = {
  x:150,
  y:200,
  speed: 5,
  moving:0,
  dirx: 0,
  diry: 0,
}

var crystal = {
  x:100,
  y:175,
  countdown: 0
}

var pScore = 0, gScore = 0, ghost = false, power = false;

//KeyClick Listeners
var keyClick = {};
document.addEventListener("keydown", function(event){
  keyClick[event.keyCode] = true;
  move(keyClick);
}, false);

document.addEventListener("keyup", function(event){
  delete keyClick[event.keyCode];
}, false);


//Canvas & Images
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
document.body.append(canvas);

canvas.width = 600;
canvas.height = 400;

context.fillStyle = "blue";
context.fillRect(0,0, canvas.width, canvas.height);

mainImage = new Image();
ghostImage = new Image();
powerUpImage = new Image();


mainImage.src = "https://i.postimg.cc/kg6rzCGt/the-knight.png";

ghostImage.src = "https://i.postimg.cc/DzGZvJ2Q/Ghosts.png";

powerUpImage.src = "https://i.postimg.cc/nc52ggMs/diamond-417896-640.png";


mainImage.ready = false;
ghostImage.ready = false;
powerUpImage.ready = false;
mainImage.onload = checkReady();

//Check Ready & PlayGame
function checkReady(){
   this.ready=true;
   ghostImage.ready = true;
   powerUpImage.ready = true;
   playGame();
 }

 function playGame(){
   render();
   //pScore++;
   //console.log(pScore);
   requestAnimationFrame(playGame);
 }

 //Random Number
 function myNum(n){
   return Math.floor(Math.random() * n);
 }

/****************************************************/

//Rendering including Movement
 function render(){
   context.fillStyle = "black";
   context.fillRect(0,0, canvas.width, canvas.height);

   //crystalPosition();
   if(!power && crystal.countdown < 10){
     crystal.x = myNum(450);
     crystal.y = myNum(250) + 30; //So not too close to top
     power = true;
   }

   //Enemy position & movement
   if(!ghost){
     enemy.x = myNum(450);
     enemy.y = myNum(250) + 30; //So not too close to top
     ghost = true;
   }

   if (enemy.moving < 0) {
     enemy.moving = myNum(40);//eg 38. You want it around here as it's a change of dir countdown
     enemy.speed = myNum(2) + 1; //Could be 0 otherwise. Even when I increased to 4. This random number gives random change of direction too.
     enemy.dirx = 0;
     enemy.diry = 0;
     if(enemy.moving % 2){ //Even
       if(player.x < enemy.x){
         enemy.dirx = -enemy.speed; // eg -1
       } else {
         enemy.dirx = enemy.speed; //eg 1
       }
     } else {
       if (player.y < enemy.y){
         enemy.diry = -enemy.speed;
       } else {
         enemy.diry = enemy.speed;
       }
     }
   }

   enemy.moving--;

   enemy.x = enemy.x + enemy.dirx; //Wherever he started plus or minus 1
   enemy.y = enemy.y + enemy.diry; //Wherever he started plus or minus 1

//Enemy reappears on left if goes off screen right & vice versa
   if(enemy.x > canvas.width-32){enemy.x = 0};
   if(enemy.x < 0){enemy.x = canvas.width-32};
   if(enemy.y > canvas.height-32){enemy.y = 0};
   if(enemy.y < 0){enemy.y = canvas.height-32};

   //Collision Detection
   if(player.x <= crystal.x && crystal.x <= (player.x + 30) && player.y <= crystal.y && crystal.y <= (player.y + 30)){
     console.log ("Collision");
     crystal.countdown = 500;
     player.fury = true;//Can kill & can't be killed. Change player image.
     crystal.x = -20;
     crystal.y = -20;
     power = false;
      }

      if(crystal.countdown > 0){
        crystal.countdown--;
        console.log(crystal.countdown);
       }





 //Score & Sprites
   context.font = "20px Verdana";
   context.fillStyle = "white";
   context.fillText("Score: " +pScore + " Lives: " +gScore, 2, 18);


   context.drawImage(ghostImage, 20, 0, 32, 32, enemy.x, enemy.y, 64, 64);


   context.drawImage(powerUpImage, crystal.x, crystal.y, 32, 32);

   context.drawImage(mainImage, player.spritex, player.spritey, 32, 32, player.x, player.y, 32, 32);

}


//Player Move
 function move(keyClick){
   if(87 in keyClick){
     player.y-=10;
     player.spritex = 96;
     player.spritey = 0;
   }
   if(65 in keyClick){
     player.x-=10;
     player.spritex = 32;
      player.spritey = 0;
   }
   if(83 in keyClick){
     player.y+=10;
     player.spritex = 0;
     player.spritey = 0;
   }
   if(68 in keyClick){
     player.x+=10;
     player.spritey = 32;
     player.spritex = 0;
   }


   if(player.x > canvas.width-32){player.x = 0};
   if(player.x < 0){player.x = canvas.width-32};
   if(player.y > canvas.height-32){player.y = 0};
   if(player.y < 0){player.y = canvas.height-32};

   render();

 }

 function crystalPosition(){
   power = true;
   render();
 }

}
