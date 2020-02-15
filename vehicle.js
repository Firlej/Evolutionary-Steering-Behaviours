class Vehicle extends Entity {

	constructor() {
		super();
		this.id = -1;

		this.vel = vec(0, 1).setMag(MAX_SPEED).rotate(random(0, TWO_PI));
		this.acc = vec(0, 0);
		this.r = 6;

		this.target = this.pos.copy();

		this.health = 1;

		this.fitness = 0;

		this.seeking = true;

		this.dna = random_dna();
	}

	reset_dna() {
		this.dna = random_dna()
	}

	mutate() {
		for (a in this.dna) {
			for (b in this.dna[a]) {
				if (random(0, 1) < MUTATION_RATE) {
					this.dna[a][b] += random(-0.5, 0.5);
					if (a == "RADIUS") {
						this.dna[a][b] = max(0, this.dna[a][b]);
					}
					if (random(0, 1) < MUTATION_RATE) {
						this.dna[a][b] = random_dna()[a][b];
					}
				}
			}
		}
	}

	update() {
		if (this.dead) {
			return;
		}

		let dsq = distSq(this.pos.x, this.pos.y, this.target.x, this.target.y);
		if (dsq < pow(this.r, 4) + 1) {
			this.target = vec(random(BORDER.LEFT, BORDER.RIGHT), random(BORDER.TOP, BORDER.BOTTOM));
		}
		if (!this.seeking) {
			this.acc.add(this.seek(this.target));
		}

		this.acc.setMag(this.vel.mag() / 10);
		this.vel.add(this.acc);
		this.acc.mult(0);

		this.vel.limit(MAX_SPEED);

		this.pos.add(this.vel);

		this.fitness++;

		this.health -= HEALTH_PENALTY_EACH_FRAME;
		if (this.health < 0) {
			this.dead = true;
		}

		this.health = constrain(this.health, 0, 1);

		this.seeking = false;
	}

	seek(target) {
		return target.copy().sub(this.pos).setMag(MAX_SPEED).sub(this.vel);
	}

	collideWithEntities(Entities) {
		if (this.dead) return;

		for (const e of Entities) {
			let dsq = distSq(e.pos.x, e.pos.y, this.pos.x, this.pos.y);
			if (!e.dead && dsq < pow(this.r * 2 + e.r, 2)) {
				e.dead = true;
				this.health += Entities.healing_factor;
			}
		}
	}

	interactWithEntities(Entities) {
		let sum = vec(0, 0);
		for (const e of Entities) {
			let ds = distSq(e.pos.x, e.pos.y, this.pos.x, this.pos.y);
			if (ds < pow(this.dna.RADIUS[Entities.ID], 2)) {
				sum.add(this.seek(e.pos).mult(this.dna.MULT[Entities.ID]).div(pow(ds, this.dna.POW[Entities.ID] / 2)));
				this.seeking = true;
			}
		}
		this.acc.add(sum);
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

		noFill();

		if (drawPerception && !this.dead) {
			stroke(rgba(0, 255, 0, 0.8));
			ellipse(0, 0, this.dna.RADIUS[FOODS.ID]);
			stroke(rgba(255, 0, 0, 0.8));
			ellipse(0, 0, this.dna.RADIUS[POISONS.ID]);
		}

		pop();

		if (this.dead) return;
		fill('yellow');
		ellipse(this.target.x, this.target.y, 7);
	}
}

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

let next_vehicle_id = 0;

VEHICLES.add = function (n = 1) {
	for (var i = 0; i < n; i++) {
		let v = new Vehicle();
		v.id = next_vehicle_id++;
		this.push(v);
	}
	if (n == 1) {
		return this.last();
	}
}

let random_dna = () => {
	return {
		MULT: {
			[ID.FOOD]: random(-LIMIT.MULT, LIMIT.MULT),
			[ID.POISON]: random(-LIMIT.MULT, LIMIT.MULT),
		},
		RADIUS: {
			[ID.FOOD]: random(0, min(width, height) / 5),
			[ID.POISON]: random(0, min(width, height) / 5),
		},
		POW: {
			[ID.FOOD]: random(-5, 5),
			[ID.POISON]: random(-5, 5),
		}
	}
}