var vehicles = [];

var maxMult = 5;
var maxPerc = 200;

var maxspeed = 3.5;
var maxTurnForce = 0.15;

function vehicleClass() {
	this.pos = createVector(random(spawnBorder, width-spawnBorder), random(spawnBorder, height-spawnBorder));
	this.vel = createVector(random(-2, 2), random(-2, 2));
	this.acc = createVector();
	this.r = 6;

	this.fitness = 0;
	this.dead = false;
	this.health = 1;
	this.thirst = 0;
//random(0.3, 0.4);

	this.dna = {
		foodMult: random(-maxMult,maxMult),
		foodPerc: random(0,maxPerc),
		poisonMult: random(-maxMult,maxMult),
		poisonPerc: random(0,maxPerc),
		waterMult: random(-maxMult,maxMult),
		waterPerc: random(0,maxPerc)
	}
	
	this.eat = function(list, perception, lifeGain, thirstGain) {
		var record = Infinity;
		var closest = null;
		for(var i=list.length-1; i>=0; i--) {
			var d = this.pos.dist(list[i].pos);
			if (d<this.r*2) {
				list.splice(i, 1);
				this.addHealth(lifeGain);
				this.addThirst(thirstGain);
			} else if (d<record && d<perception) { 
				record=d;
				closest = list[i].pos;
			}
		}
		if (closest!=null) {
			return this.seek(closest);
		}
		return createVector(0, 0);
	}

	this.seek = function(target) {
		var desired = p5.Vector.sub(target, this.pos);
		
		desired.setMag(maxspeed);

		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(maxTurnForce);
		
		return steer;
	}

	this.behaviour = function(foodList, poisonList, waterList) {
		var steer1 = this.eat(foodList, this.dna.foodPerc, 0.05, 0.01);
		var steer2 = this.eat(poisonList, this.dna.poisonPerc, -0.34, -0.05);
		var steer3 = this.eat(waterList, this.dna.waterPerc, 0, -0.05);

		steer1.mult(this.dna.foodMult);
		steer2.mult(this.dna.poisonMult);
		steer3.mult(this.dna.waterMult);

		this.acc.add(steer1);
		this.acc.add(steer2);
		this.acc.add(steer3);
	}

	this.boundaries = function() {
		if (this.pos.x>width-spawnBorder || this.pos.x<spawnBorder) {
			this.acc.add(this.seek(createVector(width/2, this.pos.y)));
		}
		if (this.pos.y>height-spawnBorder || this.pos.y<spawnBorder) {
			this.acc.add(this.seek(createVector(this.pos.x, height/2)));
		}

		
	}

	this.update = function() {
		if (this.dead==true) { return; }

		this.boundaries();
		this.vel.add(this.acc);
		this.vel.limit(maxspeed);
		this.pos.add(this.vel);

		this.acc.mult(0);

		this.addThirst(0.002);
		this.addHealth(-this.thirst/100);
		this.fitness++;
	}

	this.addHealth = function(amount) {
		this.health+=amount;
		if (this.health>1) { this.health=1; }
	}
	this.addThirst = function(amount) {
		this.thirst+=amount;
		if (this.thirst>1) { this.thirst=1; }
		else if (this.thirst<0) { this.thirst=0; }
	}

	this.limit = function() {
		if(this.dna.foodMult>maxMult) { this.dna.foodMult=maxMult; }
		else if(this.dna.foodMult<-maxMult) { this.dna.foodMult=-maxMult; }
		if(this.dna.foodPerc>maxPerc) { this.dna.foodPerc=maxPerc; }

		if(this.dna.poisonMult>maxMult) { this.dna.poisonMult=maxMult; }
		else if(this.dna.poisonMult<-maxMult) { this.dna.poisonMult=-maxMult; }
		if(this.dna.poisonPerc>maxPerc) { this.dna.poisonPerc=maxPerc; }
	}

	this.draw = function() {
		//if (this.dead==true) { return; }
		if (this.pos.x>width || this.pos.x<0 || this.pos.y>height || this.pos.y<0) { return; }

		var gr = color(0, 255, 0);
		var rd = color(255, 0, 0);
		var col = lerpColor(rd, gr, this.health);

	    push();
		    translate(this.pos.x,this.pos.y);

		    if(drawPerception==true && this.dead==false) {
		    	noFill(); 
		    	stroke(0, 255, 0, 80);
			    ellipse(0, 0, this.dna.foodPerc*2, this.dna.foodPerc*2);
			    stroke(255, 0, 0, 80);
			    ellipse(0, 0, this.dna.poisonPerc*2, this.dna.poisonPerc*2);
			    stroke(0, 0, 255, 80);
			    ellipse(0, 0, this.dna.waterPerc*2, this.dna.waterPerc*2);
		    }

		    rotate(this.vel.heading()+PI/2);

			fill(col); stroke(col);
		    beginShape();
			    vertex(0, -this.r*2);
			    vertex(-this.r, this.r*2);
			    vertex(this.r, this.r*2);
		    endShape(CLOSE);
	    pop();
	}
}

function addVehicles(n) { 
	for(var i=0; i<n; i++) {
		addVehicle();
	}
}
function addVehicle(){
	var vehicle = new vehicleClass();
	vehicles.push(vehicle);
	return vehicle;
}
function drawVehicles() {
	stroke(200);
	strokeWeight(2);
	for(var i=0; i<vehicles.length; i++) {
		vehicles[i].draw();
	}
}
function updateVehicles() {
	//var factors = [foods, poisons];

	for(var i=0; i<vehicles.length; i++) {
		vehicles[i].behaviour(foods, poisons, waters);
		vehicles[i].update();
	}

	killVehicles();
}
function killVehicles() {
	for(var i=vehicles.length-1; i>=0; i--) {
		var v = vehicles[i];
		if (v.health<=0) {
			v.dead = true;
			//vehicles.splice(i, 1);
		}

	}
}
function countAlive() {
	var count = 0;
	for(var i=0; i<vehicles.length; i++) {
		if (vehicles[i].dead==false) { count++; }
	}
	return count;
}

