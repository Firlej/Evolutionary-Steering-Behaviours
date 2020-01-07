function setup(callback) {
	resizeCanvas(windowWidth, windowHeight);
	setVariables();

	background(rgb(50, 50, 50));

	VEHICLES.add(VEHICLES.amount);

	resetResources();

	callback();
}

function draw() {
	background(rgb(50, 50, 50));

	drawInfo();

	resupplyResources(0);

	VEHICLES.update();
	VEHICLES.draw();

	fill(rgba(0, 255, 0, 0.7));
	FOODS.draw();
	fill(rgba(255, 0, 0, 0.7));
	POISONS.draw();

	VEHICLES.forEach((vehicle) => {
		vehicle.collideWithEntities(FOODS);
		vehicle.collideWithEntities(POISONS);
	});

	VEHICLES.forEach((vehicle) => {
		vehicle.interactWithEntities(FOODS);
		vehicle.interactWithEntities(POISONS);
	});

	FOODS.remove();
	POISONS.remove();
}

function mousePressed() {
	drawPerception = !drawPerception;
}

function keyPressed() {
	if (keyCode === 32) {
		noLoop();
	}
}

// function populate() {
// 	var tickets = [];
// 	if (countAlive()<=0) {

// 		var oldPopulation = vehicles.slice(0);
// 		vehicles = [];

// 		for(var i=0; i<oldPopulation.length; i++) {
// 			var v=oldPopulation[i];
// 			for (var j=0; j<(v.fitness); j++) { tickets.push(i); }
// 		}
// 		console.log(tickets.length);

// 		for(var i=0; i<vehiclesAmount; i++) {
// 			var v = addVehicle();
// 			if (random()>mutationRate) { v.dna.foodMult = randomParent().dna.foodMult; }
// 			if (random()>mutationRate) { v.dna.foodPerc = randomParent().dna.foodPerc; }
// 			if (random()>mutationRate) { v.dna.poisonMult = randomParent().dna.poisonMult; }
// 			if (random()>mutationRate) { v.dna.poisonPerc = randomParent().dna.poisonPerc; }
// 			if (random()>mutationRate) { v.dna.waterMult = randomParent().dna.waterMult; }
// 			if (random()>mutationRate) { v.dna.waterPerc = randomParent().dna.waterPerc; }
// 			v.limit();
// 		}
// 		resetResources();
// 	}
// 	function randomParent() {
// 		var j = tickets[floor(random(tickets.length))]
// 		return oldPopulation[j];
// 	}
// }

function drawInfo() {
	font("50px Arial");
	fill(rgb(0, 102, 153));
	text(VEHICLES.alive(), 10, 50);

	// var w = width/vehiclesAlive;
	// var h = 15;
	// var ii=0;
	// for(var i=0; i<vehicles.length; i++) {
	// 	var v = vehicles[i];
	// 	if (v.dead==false) {
	// 		var health = map(v.health, 0, 1, 0, w);
	// 		var thirst = map(v.thirst, 0, 1, 0, w);

	// 		fill(0,255,0, 50); 	rect(ii*w, (height-3*h), w*0.95, h);
	// 		fill(0,255,0); 		rect(ii*w, (height-3*h), health*0.95, h);
	// 		fill(0,0,255, 50);	rect(ii*w, (height-1.5*h), w*0.95, h);
	// 		fill(0,0,255);	rect(ii*w, (height-1.5*h), thirst*0.95, h);
	// 		ii++;
	// 	}

	// }
}

function resetResources() {
	FOODS.length = 0;
	POISONS.length = 0;
	FOODS.add(FOODS.amount);
	POISONS.add(POISONS.amount);
}

function resupplyResources() {
	if (FOODS.length < FOODS.amount) {
		FOODS.add(FOODS.amount - FOODS.length);
	}
	if (POISONS.length < POISONS.amount) {
		POISONS.add(POISONS.amount - POISONS.length);
	}
}