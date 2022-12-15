var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-20,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -(2*score/200);
    //pontuaçãoe
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%200 ===0) 
    {
      checkPointSound.play();
    }


    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if (touches.length > 0 || keyDown('SPACE') && trex.y >= height - 60){ 
      jumpSound.play() 
      trex.velocityY = -10 
      touches = [] 
    }
    
  
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.9
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
    {
      dieSound.play();
        gameState = END;
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      
      trex.changeAnimation("collided", trex_collided);
     
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

    if (touches.length>0 || keyDown("SPACE")) {
     reset();
      touches = []
    }
   }
  
 
  //impedir que o trex caia
  trex.collide(ground);
  
  
  
  drawSprites();
}


function reset()
{
gameState = PLAY
ground.velocityX = -(2*score/200);

score= 0;

gameOver.visible = false
restart.visible = false

obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();

trex.changeAnimation("running", trex_running);
}





function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-10,height-30,20,300);
   obstacle.velocityX = -(4+2*score/200);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,20,10);
    cloud.y = Math.round(random(20,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

