
var vehiclesAmount = 50;
var foodsAmount = 70;
var watersAmount = 70;
var poisonsAmount = 50;

var spawnBorder = 40;

var drawPerception=true;

var mutationRate = 0.05;


function setup() {
	createCanvas(windowWidth,windowHeight);
	
	addVehicles(vehiclesAmount);
	resetResources();
}

function draw() {
	background(51);

	drawInfo();

	updateVehicles();
	drawVehicles();

	drawFoods();
	drawPoisons();
	drawWaters();

	resupplyResources();

	populate();
}

function mousePressed() { drawPerception = !drawPerception; }
function keyPressed() { if (keyCode===32) { noLoop(); } }


function populate() {
	var tickets = [];
	if (countAlive()<=0) {
		
		var oldPopulation = vehicles.slice(0);
		vehicles = [];

		for(var i=0; i<oldPopulation.length; i++) {
			var v=oldPopulation[i];
			for (var j=0; j<(v.fitness); j++) { tickets.push(i); }
		}
		console.log(tickets.length);
		
		for(var i=0; i<vehiclesAmount; i++) {
			var v = addVehicle();
			if (random()>mutationRate) { v.dna.foodMult = randomParent().dna.foodMult; }
			if (random()>mutationRate) { v.dna.foodPerc = randomParent().dna.foodPerc; }
			if (random()>mutationRate) { v.dna.poisonMult = randomParent().dna.poisonMult; }
			if (random()>mutationRate) { v.dna.poisonPerc = randomParent().dna.poisonPerc; }
			if (random()>mutationRate) { v.dna.waterMult = randomParent().dna.waterMult; }
			if (random()>mutationRate) { v.dna.waterPerc = randomParent().dna.waterPerc; }
			v.limit();
		}
		resetResources();
	}
	function randomParent() {
		var j = tickets[floor(random(tickets.length))]
		return oldPopulation[j];
	}
}

function drawInfo() {
	var vehiclesAlive = countAlive();
	fill(0, 102, 153);
	textSize(32);
	text(vehiclesAlive, 10, 40);
	text(floor(frameRate()), width-50, 40);

	var w = width/vehiclesAlive;
	var h = 15;
	var ii=0;
	for(var i=0; i<vehicles.length; i++) {
		var v = vehicles[i];
		if (v.dead==false) {
			var health = map(v.health, 0, 1, 0, w);
			var thirst = map(v.thirst, 0, 1, 0, w);

			fill(0,255,0, 50); 	rect(ii*w, (height-3*h), w*0.95, h);
			fill(0,255,0); 		rect(ii*w, (height-3*h), health*0.95, h);
			fill(0,0,255, 50);	rect(ii*w, (height-1.5*h), w*0.95, h);
			fill(0,0,255);	rect(ii*w, (height-1.5*h), thirst*0.95, h);
			ii++;
		}
		
	}
}

function limit(x, limit) {
	if (x>limit) { x=limit;	}
}

function resetResources() {
	foods = []; poisons = []; waters = [];
	addFoods(foodsAmount);
	addPoisons(poisonsAmount);
	addWaters(watersAmount);
}

function resupplyResources() {
	if (foods.length<foodsAmount) { addFoods(foodsAmount-foods.length); }
	if (poisons.length<poisonsAmount) { addPoisons(poisonsAmount-poisons.length); }
	if (waters.length<watersAmount) { addWaters(watersAmount-waters.length); }
}