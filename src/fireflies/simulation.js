import { random } from "./utility";
import createKDTree from "static-kdtree"


export default class Simulation {
    static default_options = {
        height: 0,
        width: 0,
        depth: 0,
        count: 0,
        density: 0.0009,
        charge_rate: 0.001,
        radius: 120,
        influence: 0.1,
        drain_rate: 0.005,
        max_velocity: 1.5,
        max_velocity_change: 0.1,
        velocity_friction: 0.0001,
        velocity_rebound: 0.1,
    };

    static getDefaultOptions() {
        return {...Simulation.default_options};
    }

    constructor(options=Simulation.getDefaultOptions()) {
        this.options = options;
        this.list = [];
        this.sparks = [];
    }

    setOptions(options) {
        this.options = {
            ...Simulation.getDefaultOptions(),
            ...options,
        };
    };

    newFireflyRandomValues() {
        let {width, height, depth, max_velocity: mv, charge_rate, drain_rate} = this.options;
        return {
            x: random(0, width),
            y: random(0, height),
            z: random(0, depth),
            vx: random(-mv, mv, 100),
            vy: random(-mv, mv, 100),
            vz: random(-mv, mv, 100),
            charge: random(0, 1, 100),
            active: random(0, charge_rate + drain_rate, 10000) < charge_rate,
        };
    };

    newFirefly(values=this.newFireflyRandomValues()) {
        return {
            ...this.newFireflyRandomValues(),
            ...values,
        }
    };

    newRandomPopulation() {
        this.list = [];
        this.sparks = [];
        for(let i=0; i<this.options.count; i++) {
            let new_firefly = this.newFirefly();
            this.list.push(new_firefly);
            if(new_firefly.active) this.sparks.push(new_firefly);
        }
    };

    handleMovement(f) {
        let { width, height, depth,
            max_velocity_change: mvc,
            velocity_rebound: vr,
            max_velocity: mv,
        } = this.options;

        // random change
        f.vx += random(-mvc, mvc, 1000);
        f.vy += random(-mvc, mvc, 1000);
        f.vz += random(-mvc, mvc, 1000);

        // accelerate towards bounds
        if(f.x < 0) f.vx += vr;
        if(f.x > width) f.vx -= vr;

        if(f.y < 0) f.vy += vr;
        if(f.y > height) f.vy -= vr;

        if(f.z < 0) f.vz += vr;
        if(f.z > depth) f.vz -= vr;

        f.vx -= f.vx * this.options.velocity_friction;
        f.vy -= f.vy * this.options.velocity_friction;
        f.vz -= f.vz * this.options.velocity_friction;

        // limit velocities
        f.vx = Math.min(Math.max(f.vx, -mv), mv);
        f.vy = Math.min(Math.max(f.vy, -mv), mv);
        f.vz = Math.min(Math.max(f.vz, -mv), mv);

        // change position according to velocity
        f.x += f.vx;
        f.y += f.vy;
        f.z += f.vz;
    }

    nextFrame() {
        let new_sparks = [];
        let new_list = [];

        let tree = createKDTree(this.sparks.map(f => [f.x, f.y, f.z]));
        this.list.forEach(old_firefly => {
            let f = {...old_firefly};
            new_list.push(f);

            if( !f.active ) {
                // charge
                f.charge += this.options.charge_rate;

                // +charge influence from sparked neighbors
                tree.rnn([f.x, f.y, f.z], this.options.radius, () => {
                    f.charge += this.options.influence;
                });

                if( f.charge >= 1 ) {
                    f.charge = 1;
                    f.active = true;
                    new_sparks.push(f);
                }
            } else {
                //drain
                f.charge -= this.options.drain_rate;
                if( f.charge <= 0 ) {
                    f.charge = 0;
                    f.active = false;
                }
            }
            this.handleMovement(f);
        });

        this.list = new_list;
        this.sparks = new_sparks;
    }
}
