function setup(callback) {
	resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
	setVariables();

	background(rgb(50, 50, 50));

	VEHICLES.add(VEHICLES.amount);

	resetResources();

	noStroke();

	// VEHICLES[0].dna.MULT[FOODS.ID] = 3;
	// VEHICLES[0].dna.MULT[POISONS.ID] = -3;

	// VEHICLES[0].dna.RADIUS[FOODS.ID] = 300;
	// VEHICLES[0].dna.RADIUS[POISONS.ID] = 30;

	// VEHICLES[0].dna.POW[FOODS.ID] = 3;
	// VEHICLES[0].dna.POW[POISONS.ID] = 1;
	// VEHICLES[0].fitness = 0;

	callback();
}

function draw() {

	background(rgb(50, 50, 50));

	drawChart();

	drawInfo();

	noStroke();

	VEHICLES.draw();

	fill(rgba(0, 255, 0, 0.7));
	FOODS.draw();
	fill(rgba(255, 0, 0, 0.7));
	POISONS.draw();

	if (drawVectors) {
		lineWidth(2)
		VEHICLES.forEach((vehicle) => {
			stroke(rgba(0, 255, 0, 0.4));
			vehicle.drawVecotrs(FOODS);
			stroke(rgba(255, 0, 0, 0.4));
			vehicle.drawVecotrs(POISONS);
		});
	}

	if (stop) {
		return;
	}

	for (let i = 0; i < iterations_per_frame; i++) {

		resupplyResources();

		VEHICLES.forEach((vehicle) => {
			vehicle.collideWithEntities(FOODS);
			vehicle.collideWithEntities(POISONS);
		});

		VEHICLES.update();

		VEHICLES.forEach((vehicle) => {
			vehicle.interactWithEntities(FOODS);
			vehicle.interactWithEntities(POISONS);
		});

		FOODS.remove();
		POISONS.remove();

		populate();

		if (VEHICLES.alive() == 0) {
			break;
		}
	}
}

function mousePressed() {
	drawPerception = !drawPerception;
}

function keyPressed() {
	if (keyCode === 32) {
		stop = !stop;
	} else if (keyCode == 98) {
		drawVectors = !drawVectors;
	}
}


function populate() {

	if (VEHICLES.alive() == 0) {

		let fitness_sum = 0;
		let pre = [];
		for (let i = 0; i < VEHICLES.length; i++) {
			fitness_sum += floor(sqrt(VEHICLES[i].fitness));
			pre.push(fitness_sum);
			if (VEHICLES[i].fitness > best_fitness) {
				best_fitness = VEHICLES[i].fitness;
				best_vehicle = VEHICLES[i];
				best_vehicles.push(best_vehicle);
				console.log(best_vehicles.last());
			}
		}

		OLD_VEHICLES.length = 0;
		OLD_VEHICLES.push(...VEHICLES.splice(0));
		VEHICLES.length = 0;

		let randomParent = () => {
			let n = floor(random(0, fitness_sum));
			let index = 0;
			while (n > pre[index]) {
				index++;
			}
			return OLD_VEHICLES[index];
		}

		for (let i = 0; i < VEHICLES.amount; i++) {
			let v = VEHICLES.add(1);
			for (a in v.dna) {
				for (b in v.dna[a]) {
					v.dna[a][b] = randomParent().dna[a][b];
				}
			}
			v.mutate();
		}

		resetResources();
		pop_count++;
	}
}

function drawInfo() {
	font("50px Arial");
	fill(rgb(0, 102, 153));

	let count = VEHICLES.alive();

	textAlign('left');
	text(count, 10, 50);
	textAlign('right');
	text(best_fitness, BORDER.RIGHT - 10, 50);

	var h = height / VEHICLES.length;

	for (var i = 0; i < VEHICLES.length; i++) {
		var v = VEHICLES[i];

		fill(rgba(0, 255, 0, 0.5));
		rect(BORDER.RIGHT, i * height / VEHICLES.length, BORDER.LEFT, h);
		fill(rgba(0, 255, 0, 1));
		rect(BORDER.RIGHT, i * height / VEHICLES.length, BORDER.LEFT * v.health, h);
	}
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

function drawChart() {
	stroke(rgba(255, 255, 255, 0.7));
	lineWidth(2);
	beginShape();
	ctx.moveTo(0, height);
	let x, y;
	for (let i = 0; i < best_vehicles.length; i++) {
		x = map(best_vehicles[i].id, 0, next_vehicle_id, 0, width);
		y = map(best_vehicles[i].fitness, 0, best_fitness + 1, height * 0.95, height * 0.05);
		vertex(x, y);
	}
	vertex(width, y);
	vertex(width, height);
	endShape();
}