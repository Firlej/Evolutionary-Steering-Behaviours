const LIMIT = {
    MULT: 5,
    RADIUS: 200,
}

let drawPerception = true;

const ID = {
    FOOD: 0,
    POISON: 1
};

let population;
let previous_population;

const ENTITIES = [];

const VEHICLES = [];
const OLD_VEHICLES = [];
const FOODS = [];
const POISONS = [];

VEHICLES.amount = 10;
FOODS.amount = 20;
POISONS.amount = 30;

FOODS.ID = ID.FOOD;
POISONS.ID = ID.POISON;

FOODS.healing_factor = 0.4;
POISONS.healing_factor = -0.8;

const HEALTH_PENALTY_EACH_FRAME = 0.005;

let MUTATION_RATE = 0.1;

let iterations_per_frame = 1;

let best_fitness = 0;
let best_vehicle;

let MAX_SPEED = 3.5;

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