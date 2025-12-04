import { Base } from "./base/base.js";
export class Bullet extends Base.Ball {
    _takedowns = 0;
    constructor(radius, mass, position, velocity, acceleration, element) {
        super(radius, mass, position, velocity, acceleration, element);
    }
    get Takedowns() {
        return this._takedowns;
    }
    set Takedowns(value) {
        this._takedowns = value;
    }
    static create(position, angle, element) {
        const radius = Base.Constant.Ball.Radius.Bullet;
        const mass = Base.Constant.Ball.Mass.Bullet;
        const velocity = new Base.Vector2(Math.cos(angle), Math.sin(angle)).multiply(Base.Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Base.Vector2();
        return new Bullet(radius, mass, position, velocity, acceleration, element);
    }
    handleMove(deltaTime, handleMoveCallback) {
        super.handleMove(deltaTime, handleMoveCallback);
    }
}
