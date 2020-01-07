const LIMIT = {
    MULT: 5,
    RADIUS: 200,
}

let drawPerception = true;

const ID = {
    FOOD: 0,
    POISON: 1
};


const ENTITIES = [];

const VEHICLES = [];
VEHICLES.amount = 10;

const FOODS = [];
FOODS.amount = 10;
FOODS.healing_factor = 0.4;
FOODS.ID = ID.FOOD;

const POISONS = [];
POISONS.amount = 10;
POISONS.healing_factor = -0.4;
POISONS.ID = ID.POISON;

const MUTATION_RATE = 0.05;

const border_ratio = 0.05;
let BORDER;

function setVariables() {
    BORDER = {
        LEFT: width * border_ratio,
        TOP: height * border_ratio,
        RIGHT: width * (1 - border_ratio),
        BOTTOM: height * (1 - border_ratio),
    };
};