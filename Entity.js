class Entity {
    constructor() {
        this.pos = vec(random(BORDER.LEFT, BORDER.RIGHT), random(BORDER.TOP, BORDER.BOTTOM));
        this.r = 1;
        this.dead = false;
    }

    update() {
        //
    }

    draw() {
        if (this.dead) return;
        ellipse(this.pos.x, this.pos.y, 6, 6);
    }
}

ENTITIES.update = function () {
    for (var i = 0; i < this.length; i++) {
        this[i].update();
    }
}

ENTITIES.draw = function () {
    for (var i = 0; i < this.length; i++) {
        this[i].draw();
    }
}

ENTITIES.add = function (n = 1) {
    for (var i = 0; i < n; i++) {
        this.push(new Entity());
    }
    if (n == 1) {
        return this.last();
    }
}

ENTITIES.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i].dead) {
            this.splice(i, 1);
        }
    }
}

FOODS.update = ENTITIES.update;
FOODS.draw = ENTITIES.draw;
FOODS.add = ENTITIES.add;
FOODS.remove = ENTITIES.remove;

POISONS.update = ENTITIES.update;
POISONS.draw = ENTITIES.draw;
POISONS.add = ENTITIES.add;
POISONS.remove = ENTITIES.remove;