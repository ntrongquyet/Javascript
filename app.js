/**
 * @description Represents a dinosarus class
 * @constructor
 * @param {string} species - The species of the dinosarus
 * @param {string} image - The image of the dinosarus
 * @param {number} weight - The weight of the dinosarus
 * @param {number} height - The height of the dinosarus
 * @param {string} diet - The diet of the dinosarus
 * @param {string} where - The where of the dinosarus
 * @param {string} when - The when of the dinosarus
 * @param {string} fact - The fact of the dinosarus
 */
function Dinosarus(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.image = species ? `images/human.png` : '';
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
}

// Create Dino Compare Method 1
Dinosarus.prototype.compareWeight = function (yourWeight) {
    const diff = this.weight - yourWeight;

    return diff > 0 ? `${this.species} is ${diff} inches heavier than you` : `${this.species} is ${-diff} inches lighter than you`;
}

// Create Dino Compare Method 2
Dinosarus.prototype.compareHeight = function (yourHeight) {
    const diff = this.height - yourHeight;

    return diff > 0 ? `${this.species} is ${diff} inches taller than you` : `${this.species} is ${-diff} inches shorter than you`;
}

// Create Dino Compare Method 3
Dinosarus.prototype.compareDiet = function (yourDiet) {
    const hasSameDiet = yourDiet.toLowerCase() === this.diet;
    if (hasSameDiet) {
        this.dietDescription = `You are both ${yourDiet.diet}s, pretty cool!`;
    } else {
        this.dietDescription = `You're a ${yourDiet.diet} but the ${this.species} was a ${this.diet}.`;
    }
}

async function initialize() {
    var dinosaursData;
    // Read the contents of the JSON file
    await fetch('dino.json')
        .then(response => response.json())
        .then(data => {
            dinosaursData = data.Dinos;
        })
        .catch(error => {
            console.error("Error fetching or parsing JSON:", error);
        });

    // Create Dino Objects
    const dinoObjects = dinosaursData.map(
        (dino) =>
        new Dinosarus(
            dino.species,
            dino.weight,
            dino.height,
            dino.diet,
            dino.where,
            dino.when,
            dino.fact
        )
    );

    const humanData = new Dinosarus("human", 0, 0, null, "Earth", "Current", "People is very friendly");

    (function getHumanData() {
        const name = document.getElementById("name").value;
        const weight = document.getElementById("weight").value;
        const height = document.getElementById("feet").value +
            document.getElementById("inches").value / 12;
        const diet = document.getElementById("diet").value.toLowerCase();
        humanData.species = name;
        humanData.weight = weight;
        humanData.height = height
        humanData.diet = diet;
    })();


    dinoObjects.splice(4, 0, humanData);

    const tiles = dinoObjects.map((dino) => {
        const grid = document.createDocumentFragment();
        const divTag = document.createElement("div");
        divTag.className = "grid-item";

        const img = document.createElement("img");
        img.src = dino.image;

        const title = document.createElement("h3");
        const fact = document.createElement("p");

        if (dino.species === "human") {
			title.innerHTML = humanData.name;
		} else if (dino.species === "Pigeon") {
			title.innerHTML = dino.species;
			fact.innerHTML = dino.fact;
		} else {
			title.innerHTML = dino.species;
			fact.innerHTML = (_=> {
				let result = "";
				const randomise = getRandomInt(8);

				switch (randomise) {
					case 1:
						result = dino.compareHeight(humanData.height);
						break;
					case 2:
						result = dino.compareWeight(humanData.weight);
						break;
					case 3:
						result = dino.compareDiet(humanData.diet);
						break;
					case 4:
						result = `The ${dino.species} lived in what is now ${dino.where}.`;
						break;
					case 5:
						result = `The ${dino.species} was found in the ${dino.when}.`;
						break;
					default:
						result = dino.fact;
						break;
				}
				return result;
			})();
		}
        divTag.appendChild(title);
        divTag.appendChild(img);
        divTag.appendChild(fact);
        grid.appendChild(divTag);

        return grid;
    });

    const grid = document.getElementById("grid");
    tiles.forEach(tile => grid.appendChild(tile))

    document.getElementById('dino-compare').innerHTML = "";
}

function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * Math.floor(max));
}

const submitBtn = document.querySelector("#btn");

submitBtn.addEventListener("click", initialize);