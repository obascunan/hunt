/***********************************
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */ //////////////////////////////////
 

var mode = 'home';    // Mode defines which state of the game we are in
var wolfPercent = 20; //The percetage of random wolfs
var maxMovement = 3; //The maximun amount of movement allowed when stopped
var minMovement = 2; //The minimun amount of movement to register a step 
var maxShake = 1400 

function preload() {
  
  // Load Images
  
  _stop = loadImage("images/stop.png");
  _go = loadImage("images/go.png");
  _ready = loadImage("images/ready.png");
  _pounce = loadImage("images/pouncing.png");  
  _death = loadImage("images/death.png");
  _tap = loadImage("images/tap.png");
  _deer = loadImage("images/deer.png");
  _wolf = loadImage("images/wolf.png");
  
}
var afterlifeTime = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(50);
  afterlifeTime = new Date().getTime();
}

function draw() {
  switch (mode) {
    case 'home':
      drawHome();
      break;
    case 'deer':
      drawDeer();
      break;
    case 'death':
      drawDeath();
      break;
    case 'wolf':
      drawWolf();
      break;
    case 'wolfScreen':
      drawWolfScreen();
      break;
    case 'deerScreen':
      drawDeerScreen();
      break;
    case 'revive':
      drawDeathAndAfterlife();
      break;
  }

}
 
 // Draws when you get assigned as a wolf 
var drawWolfTime = 0;
function drawWolfScreen(){
  fade = (new Date().getTime() - drawWolfTime) / 5;
  var c = color(232, 12, 122, fade);
  background(232, 12, 122);
  drawCentered(_wolf);
  fill(c);
  rect(0, 0, windowWidth, windowHeight);
  if(fade>300){
    mode = 'wolf';
  }
}
 // Draws when you get assigned as a Deer 
function drawDeerScreen(){
  fade = (new Date().getTime() - drawDeerTime) / 5;
   var c = color(232, 12, 122, fade);
  background(232, 12, 122);
  drawCentered(_deer);
  fill(c);
  rect(0, 0, windowWidth, windowHeight);
  if(fade>400){
    mode = 'deer';
  }
}
/*
    Get the mouse pressed for when the screen is touched
    The actions depend on the modes so 

*/ 
var drawDeerTime = 0;
function mousePressed() {
  switch (mode) {
    case 'home':

      var randomRoll = random(100);
      if (randomRoll > wolfPercent) {
        console.log('Mode: Deer');
        drawDeerTime = new Date().getTime();
        mode = 'deerScreen';
      } else {
        console.log('Mode: Wolf');
        drawWolfTime = new Date().getTime();
        mode = 'wolfScreen';
      }

      break;
    case 'deer':

      console.log('Mode: Death');
      afterlifeTime = new Date().getTime();

      mode = 'revive';

      break;
    case 'death':
      break;
    case 'wolf':
      break;
  }
}

// DEER CODE
var currentPeriod = 0;
var deerWalkingTime = 2000;
var deerStoppingTime = 2000;
var played = false;

function drawDeer() {

  background(255);

  currentPeriod = (new Date().getTime()) % (deerWalkingTime + deerStoppingTime);

  textSize(60);
  if (currentPeriod > deerWalkingTime) {
    //STOP


    background(0);
    noStroke();
    fill(255, 0, 0);
    ranAmp = 200;


    if (isMoving(maxMovement)) {
      shakingAmp += 30;
      quad(windowWidth / 2, windowHeight / 2 - shakingAmp + random(ranAmp) - ranAmp / 2, windowWidth / 2 + shakingAmp + random(ranAmp) - ranAmp / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2 + shakingAmp + random(ranAmp) - ranAmp / 2, windowWidth / 2 - shakingAmp + random(ranAmp) - ranAmp / 2, windowHeight / 2);
      wolfLastPounce = new Date().getTime();

      /* Death Mechanism - Not fair for all devices
      if (shakingAmp > maxShake) {
        mode = 'death';
      }*/
    }

    drawCentered(_stop);

    played = false;
  } else {
    //GO
    background(232, 12, 122);
    amplitude = (millis()) % windowHeight * 2;

    from = color(232, 12, 122);
    to = color(255, 13, 255);
    colorMode(RGB); // Try changing to HSB.
    interA = lerpColor(from, to, amplitude / windowHeight);

    stroke(interA);
    ellipseMode(CENTER)
    noFill(); // Set fill to gray
    strokeWeight(amplitude / windowWidth * 20);
    ellipse(windowWidth / 2, windowHeight / 2, amplitude, amplitude);
    drawCentered(_go);
  }

}

ppp = 0;

var orbitRad = 100;
var orbitDuration = 4000;
var planetSize = 100;

function drawHome() {
  // Draw Homescreen  
  var ang = TWO_PI * millis() / orbitDuration;
  var x = cos(ang) * orbitRad;
  var y = sin(ang) * orbitRad;

  to = color(107, 0, 107);
  from = color(232, 12, 122);
  colorMode(RGB); // Try changing to HSB.
  inter = lerpColor(from, to, y/orbitRad);
  
  background(inter);
  noStroke();
  push();
  translate(width / 2, height / 2);
  fill(255);
  ellipse(x, y, planetSize, planetSize);
  var moonColor = (y + orbitRad) / (orbitRad * 2) * 200;
  fill(moonColor);
  ellipse(-x, -y, planetSize, planetSize);
  pop();

  imageMode(CENTER);
  image(_tap, windowWidth / 2, windowHeight / 2 + 200);


}


function drawDeath() {
  background(255);
  drawCentered(_death);
}
var fade = 0;

// Draws when a deer is killed and rebourned as a wolf
function drawDeathAndAfterlife() {
  background(255);
  noStroke();
  drawCentered(_death);
  
  fade = (new Date().getTime() - afterlifeTime) / 5;
  
  if(fade < 400){
    c = color(255, 255, 255, fade);
  } else {
    c = color(655-fade);
  }
  fill(c);
  rect(0, 0, windowWidth, windowHeight);

  if(fade >= 680){
    drawWolfTime = new Date().getTime();
    mode = 'wolfScreen';
  }
}
var moving = true;
/* The wolf section 
 
*/
var wolfWalkingTime = 1500;
var wolfStopTime = 1500;
var wolfCanMove = true;
var wolfLastPounce = 0;
var wolfStartedMoving = false;
var shakingAmp = 0;

// Draws the wolf mechanics
function drawWolf() {
  //wolf can move or is waiting
  //if can move and moved, he is moving until time stops

  if (wolfCanMove) {

    if (wolfStartedMoving) {
      background(232, 12, 122);
      // drawCentered(_go);
      //text("HOME", 50, 80);
      //  ppp++;
      amplitude = (millis()) % windowHeight * 2;

      from = color(232, 12, 122);
      to = color(255, 13, 255);
      colorMode(RGB); // Try changing to HSB.
      interA = lerpColor(from, to, amplitude / windowHeight);

      stroke(interA);
      ellipseMode(CENTER)
      noFill(); // Set fill to gray
      strokeWeight(amplitude / windowWidth * 20);
      ellipse(windowWidth / 2, windowHeight / 2, amplitude, amplitude);
      drawCentered(_pounce);

    } else {

      background(20, 200, 200);
      amplitude = 200 * cos(millis() / 400);
      noStroke();
      fill(220);
      quad(windowWidth / 2, windowHeight / 2 - amplitude, windowWidth / 2 + amplitude, windowHeight / 2, windowWidth / 2, windowHeight / 2 + amplitude, windowWidth / 2 - amplitude, windowHeight / 2);

      drawCentered(_ready);

    }

    if (isMoving(minMovement) && !wolfStartedMoving) {
      //Start moving
      wolfStartedMoving = true;
      wolfLastPounce = new Date().getTime();
    }

    if (wolfStartedMoving && new Date().getTime() > wolfLastPounce + wolfWalkingTime) {
      //stop movement
      wolfCanMove = false;
    }
  } else {
    background(0);
    /*if(isMoving(minMovement)){
      background(200,20,20);
    } else {
      background(0);
    }*/
    //stop and wait for time

    noStroke();
    fill(255, 0, 0);
    ranAmp = 200;


    if (isMoving(maxMovement)) {
      shakingAmp += 30;
      quad(windowWidth / 2, windowHeight / 2 - shakingAmp + random(ranAmp) - ranAmp / 2, windowWidth / 2 + shakingAmp + random(ranAmp) - ranAmp / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2 + shakingAmp + random(ranAmp) - ranAmp / 2, windowWidth / 2 - shakingAmp + random(ranAmp) - ranAmp / 2, windowHeight / 2);
      wolfLastPounce = new Date().getTime();
    /* Death Mechanism - Not fair for all devices
      if (shakingAmp > maxShake) {
        mode = 'death';
      }*/
    }

    drawCentered(_stop);

    if (new Date().getTime() > wolfLastPounce + wolfStopTime + wolfWalkingTime) {
      //can move again
      wolfCanMove = true;
      wolfStartedMoving = false;
      shakingAmp = 0;
    }
  }
}

function drawCentered(_img) {
  imageMode(CENTER);
  image(_img, windowWidth / 2, windowHeight / 2);
}

function isMoving(threshold) {
  if (accelerationX > threshold || accelerationY > threshold || accelerationZ > threshold) {
    return true;
  } else {
    return false;
  }
}