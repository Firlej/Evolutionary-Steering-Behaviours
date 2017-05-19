var foods = [];

function foodClass() {
	this.pos = createVector(random(spawnBorder, width-spawnBorder), random(spawnBorder, height-spawnBorder));

	this.draw = function() {
		ellipse(this.pos.x, this.pos.y, 6, 6);
	}
}
function addFoods(n) { 
	for(var i=0; i<n; i++) {
		addFood();
	}
}
function addFood() {
	var food = new foodClass();
	foods.push(food);
	return food;
}

function drawFoods() {
	fill(50, 255, 50);
	noStroke();
	for(var i=0; i<foods.length; i++) {
		foods[i].draw();
	}
}