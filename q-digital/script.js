class Plane {
    name;
    maxSpeed;
    state = false;
    constructor(name, maxSpeed) {
        this.name = name;
        this.maxSpeed = maxSpeed;
    }

    takeoff() {
        this.state = true;
    }
    landing() {
        this.state = false;
    }
    inAir() {
        if (this.state) {
            return (
                this.name +
                " В воздухе на скорости " +
                parseInt(Math.random() * this.maxSpeed) +
                "км/ч."
            );
        } else return this.name + " На земле";
    }
}

class MilitaryPlane extends Plane {
    attack() {
        return this.name + " атакует!";
    }
}

const plane1 = new MilitaryPlane("МИГ", 1000);
const plane2 = new Plane("ТУ-154", 700);
plane1.takeoff();

console.log(plane1.inAir());
console.log(plane1.attack());
console.log(plane2.inAir());
