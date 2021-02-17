var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sonic, sonic_running, sonic_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  sonic_running = loadAnimation("images/sonic-1.png", "images/sonic-2.png", "images/sonic-3.png", "images/sonic-4.png", "images/sonic-5.png");
  sonic_collided = loadAnimation("images/sonic_collided.png");
  
  groundImage = loadImage("images/bg4.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  


  obstacle1 = loadImage("images/obstacle-1.png");
  obstacle2 = loadImage("images/obstacle-2.png");
  obstacle3 = loadImage("images/obstacle-3.png")
  obstacle4 = loadImage("images/obstacle-4.png")
  
  
  restartImg = loadImage("images/restart.png") 
  gameOverImg = loadImage("images/gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
    createCanvas(windowWidth , windowHeight );

    ground = createSprite(200,height/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2.5;
    
  sonic = createSprite(50,height - 70,20,50);
  sonic.addAnimation("running", sonic_running);
  sonic.addAnimation("collided", sonic_collided);
  sonic.scale = 2.5;
  
  
  
  gameOver = createSprite(700,500);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,350);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  console.log(height);
  console.log(sonic.y);

  invisibleGround = createSprite(200 ,height - 70,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  
  
  score = 0;
  
}

function draw() {
  
  background(100);
  //displaying score
 
  
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = width/2;
    }
    
    

    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("space"))&& sonic.y >= height / 2) {
      sonic.velocityY = -12;
        jumpSound.play();
        touches = [];
        
    }
    
    //add gravity
    sonic.velocityY = sonic.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(sonic)){
        //sonic.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
           
     //change the sonic animation
     sonic.changeAnimation("collided", sonic_collided);
    
     if(mousePressedOver(restart) || (touches.length > 0 || keyDown("space"))) {
      reset();
    }
     
      ground.velocityX = 0;
      sonic.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop sonic from falling down
  sonic.collide(invisibleGround);
  
  drawSprites();

  fill ("white")
  textSize(20)
  text("Score: "+ score, 30,50);  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  sonic.changeAnimation("running", sonic_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   score = 0;
  
}


function spawnObstacles(){
 if (frameCount % 150 === 0){
   var obstacle = createSprite(width,height - 125,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
       case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(80,500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = sonic.depth;
    sonic.depth = sonic.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

