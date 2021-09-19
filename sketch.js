const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var ground, leftwall, rightwall, bridge, jointPoint, jointLink;
var stones = [];
var zombie;


function preload() {
  zombieImage = loadImage("./assets/sad_zombie.png")
  zombie1 = loadImage("./assets/zombie1.png");
  zombie2 = loadImage("./assets/zombie2.png");
  zombie3 = loadImage("./assets/zombie3.png");
  zombie4 = loadImage("./assets/zombie4.png");
  backgroundImage = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftwall = new Base(159, height / 2 + 50, 600, 100);
  rightwall = new Base(width - 185, height / 2 + 50, 600, 100);

  bridge = new Bridge(15, { x: width / 2 - 400, y: height / 2 });
  jointPoint = new Base(width - 501, height / 2 + 30, 40, +1000);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-10, 140);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }
  zombie = createSprite(width / 2, height - 110);
  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft", zombie3, zombie4, zombie3);
  zombie.addImage("sad", zombieImage);
  zombie.scale = 0.1;
  zombie.velocityX = 10;
  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);
  ground.display();
  leftwall.display();
  rightwall.display();
  bridge.show();
  for (var stone of stones) {
    stone.display();
    var pos = stone.body.position;
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
    }
  }
  if (zombie.position.x >= width - 300 && !collided) {
    zombie.velocityX = -10;
    zombie.changeAnimation("righttoleft");
  }
  if (zombie.position.x <= 300 && !collided) {
    zombie.velocityX = 10;
    zombie.changeAnimation("lefttoright");
  }
  drawSprites();
}

function handleButtonPress() {
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
