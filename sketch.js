var canvas;
var backgroundImg;
var mario, marioImage, marioHeadImage, marioDeadImage;
var ground, groundImg, invisibleGround;
var enemy, enemy1, enemy2, enemy3, enemy4, enemy5, enemyGroup;
var coin, coinGroup, coinImage;
var pipe, pipeGroup, pipeImage;
var cloud, cloudGroup, cloudImage;
var bullet, bulletGroup, bulletImage;
var score, coinCount;

const PLAY = 1;
const END = 0;
var gameState = PLAY;

function preload()
{
    backgroundImg = loadImage("images/bg.png");

    groundImg = loadImage("images/ground.png");
    cloudImage = loadImage("images/cloud.png");
    coinImage = loadImage("images/coin.png");
    bulletImage = loadImage("images/bullet.png");
    pipeImage = loadImage("images/pipes.png");
    
    marioImage = loadAnimation("images/mario_01.png", "images/mario_02.png", "images/mario_03.png", "images/mario_04.png");
    marioDeadImage = loadImage("images/mario_dead.png");
    marioHeadImage = loadImage("images/mario_head.png");

    enemy1 = loadImage("images/enemy_01.png");
    enemy2 = loadImage("images/enemy_02.png");
    enemy3 = loadImage("images/enemy_03.png");
    enemy4 = loadImage("images/enemy_04.png");
    enemy5 = loadImage("images/enemy_05.png");
}

function setup()
{
    canvas = createCanvas(800, 600);

    score = 0;
    coinCount = 0;

    ground = createSprite(width, height - 10, width, 20);
    ground.addImage(groundImg);
    ground.scale = 0.7;

    invisibleGround = createSprite(width/2, height - 9, width, 20);
    invisibleGround.visible = false;

    mario = createSprite(80, height - 40, 50, 50);
    mario.addAnimation("mario", marioImage);
    mario.addAnimation("dead", marioDeadImage);
    mario.scale = 0.4;

    enemyGroup = new Group();
    pipeGroup = new Group();
    bulletGroup = new Group();
    coinGroup = new Group();
    cloudGroup = new Group();

    fill("black");
    stroke("black");
    textSize(20);
    textFont("cambria");
}

function draw()
{
    background(backgroundImg);

    text("SCORE : " + score, 40, 25);
    text("COIN COUNT : " + coinCount, 400, 25);

    if(gameState === PLAY)
    {
        if(frameCount % 20 === 0)
        {
            score++;
        }

        ground.velocityX = -5;
        if(ground.x < 0)
        {
            ground.x = width;
        }

        if(keyDown(UP_ARROW) && mario.y >= 530)
        {
            mario.velocityY = -15;
        }
        mario.velocityY = mario.velocityY + 0.8;

        if(keyDown("space"))
        {
            releaseBullet();
        }

        if(bulletGroup.isTouching(enemyGroup))
        {
            bulletGroup.destroyEach();
            enemyGroup.destroyEach();
            score += 2;
        }

        for(var i = 0; i <coinGroup.length; i++)
        {
            if(coinGroup.isTouching(mario))
            {
                coinGroup.get(i).destroy();
                coinCount++;
            }
        }

        if(enemyGroup.isTouching(mario))
        {
            score--;
            gameState = END;
        }

        if(pipeGroup.isTouching(mario))
        {
            score -= 2;
            gameState = END;
        }

        spawnEnemy();
        spawnPipe();
        spawnCoin();
        spawnCloud();
    }

    if(gameState === END)
    {
        enemyGroup.setVelocityXEach(0);
        enemyGroup.setLifetimeEach(-1);

        pipeGroup.setVelocityXEach(0);
        pipeGroup.setLifetimeEach(-1);

        coinGroup.setVelocityXEach(0);
        coinGroup.setLifetimeEach(-1);

        cloudGroup.setVelocityXEach(0);
        cloudGroup.setLifetimeEach(-1);

        bulletGroup.destroyEach();

        ground.velocityX = 0;

        mario.velocityX = 0;
        mario.velocityY = 0;
        mario.changeAnimation("dead", marioDeadImage);
        mario.y = height - 10;
    }

    mario.collide(invisibleGround);
    drawSprites();
}

function releaseBullet()
{
    bullet = createSprite(mario.x, mario.y, 20, 10);
    bullet.addImage(bulletImage);
    bullet.scale = 0.1;
    bullet.velocityX = 5;
    bulletGroup.add(bullet);
}

function spawnEnemy()
{
    if(frameCount % 300 === 0)
    {
        enemy = createSprite(width, height - 55, 50, 50);
        enemy.velocityX = -4;

        var rand = Math.round(random(1, 5));
        switch(rand)
        {
            case 1:
                enemy.addImage(enemy1);
                break;
            case 2:
                enemy.addImage(enemy2);
                break;
            case 3:
                enemy.addImage(enemy3);
                break;
            case 4:
                enemy.addImage(enemy4);
                break;
            case 5:
                enemy.addImage(enemy5);
                break;
            default: break;
        }

        enemy.scale = 0.4;
        enemy.lifetime = 300;

        mario.depth = enemy.depth + 1;

        enemyGroup.add(enemy);
    }
}

function spawnPipe()
{
    if(frameCount % 200 === 0)
    { 
        pipe = createSprite(width, height - 70, 10, 10);
        pipe.addImage(pipeImage);
        pipe.scale = 0.5;
        pipe.velocityX = -5;
        pipe.lifetime = 160;

        mario.depth = pipe.depth + 1;

        pipeGroup.add(pipe);
    }
}

function spawnCoin()
{
    if(frameCount % 100 === 0)
    {
        coin = createSprite(width, height / 2 + 50, 10, 10);
        coin.addImage(coinImage);
        coin.scale = 0.4;
        coin.velocityX = -4;
        coin.lifetime = 200;

        mario.depth = coin.depth + 1;

        coinGroup.add(coin);
    }
}

function spawnCloud()
{
    if(frameCount % 100 === 0)
    { 
        cloud = createSprite(width, random(80, 250), 10, 10);
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -2;
        cloud.lifetime = 400;

        mario.depth = cloud.depth + 1;

        cloudGroup.add(cloud);
    }
}