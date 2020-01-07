class Vehicle extends Entity {

	constructor() {
		super();

		this.vel = vec(0, 1).setMag(Vehicle.MAX_SPEED).rotate(random(0, TWO_PI));
		this.acc = vec(0, 0);
		this.r = 6;

		this.health = 1;

		this.fitness = 0;

		this.dna = {
			MULT: {
				[ID.FOOD]: random(-LIMIT.MULT, LIMIT.MULT),
				[ID.POISON]: random(-LIMIT.MULT, LIMIT.MULT),
			},
			RADIUS: {
				[ID.FOOD]: random(0, min(width, height) / 5),
				[ID.POISON]: random(0, min(width, height) / 5),
			}
		}
	}

	update() {
		if (this.dead) {
			return;
		}

		this.boundaries();

		this.vel.add(this.acc);
		this.acc.mult(0);

		this.vel.limit(Vehicle.MAX_SPEED);

		this.pos.add(this.vel);

		this.fitness++;

		this.health -= 0.005;
		if (this.health < 0) {
			this.dead = true;
		}
		this.health = constrain(this.health, 0, 1);
	}

	seek(target) {
		let desired = target.copy().sub(this.pos).setMag(Vehicle.MAX_SPEED);

		let steer = desired.copy().sub(this.vel);

		steer.limit(Vehicle.MAX_TURN_FORCE);

		return steer;
	}

	boundaries() {
		if (this.pos.x > BORDER.RIGHT || this.pos.x < BORDER.LEFT || this.pos.y > BORDER.BOTTOM || this.pos.y < BORDER.TOP) {
			this.vel.mult(0);
			this.acc.mult(0);
			this.acc.add(this.seek(vec(width / 2, height / 2)).mult(1));
		}
	}

	collideWithEntities(Entities) {
		for (const e of Entities) {
			let dsq = distSq(e.pos.x, e.pos.y, this.pos.x, this.pos.y);
			if (!e.dead && dsq < pow(this.r + e.r, 2)) {
				e.dead = true;
				this.health += Entities.healing_factor;
			}
		}
	}

	interactWithEntities(Entities) {
		let bestVal = Infinity;
		let bestEntity = false;

		for (const e of Entities) {
			let dsq = distSq(e.pos.x, e.pos.y, this.pos.x, this.pos.y);
			// todo check if in range
			if (dsq < bestVal) {
				bestVal = dsq;
				bestEntity = e;
			}
		}
		this.acc.add(this.seek(bestEntity.pos).mult(this.dna.MULT[Entities.ID]));
	}

	draw() {
		push();

		translate(this.pos.x, this.pos.y);

		rotate(this.vel.heading() + PI / 2);

		fill(lerpColor("#FF0000", "#00FF00", this.health));

		beginShape();
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r * 2);
		vertex(this.r, this.r * 2);
		endShape();

		if (drawPerception && !this.dead) {
			fill(rgba(0, 0, 0, 0));
			stroke(0, 255, 0, 80);
			ellipse(0, 0, this.dna.foodPerc * 2, this.dna.foodPerc * 2);
			stroke(255, 0, 0, 80);
			ellipse(0, 0, this.dna.poisonPerc * 2, this.dna.poisonPerc * 2);
			stroke(0, 0, 255, 80);
			ellipse(0, 0, this.dna.waterPerc * 2, this.dna.waterPerc * 2);
		}

		pop();
	}
}

Vehicle.MAX_SPEED = 3.5;
Vehicle.MAX_TURN_FORCE = 0.15;

VEHICLES.alive = function () {
	var n = 0;
	for (var i = 0; i < this.length; i++) {
		if (!this[i].dead) {
			n++;
		}
	}
	return n;
}

VEHICLES.update = ENTITIES.update;

VEHICLES.draw = ENTITIES.draw;

VEHICLES.add = function (n = 1) {
	for (var i = 0; i < n; i++) {
		this.push(new Vehicle());
	}
	if (n == 1) {
		return this.last();
	}
}