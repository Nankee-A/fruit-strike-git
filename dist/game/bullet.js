import { Ball, Constant, Vector2 } from "./base/index.js";
import { Player } from "./player.js";
export class Bullet extends Ball {
    _id;
    _kill = 0;
    _bounces = 0;
    constructor(id, radius, mass, position, velocity, acceleration, element) {
        super(radius, mass, position, velocity, acceleration, element);
        this._id = id;
    }
    get Id() {
        return this._id;
    }
    get Kill() {
        return this._kill;
    }
    get Bounces() {
        return this._bounces;
    }
    set Bounces(value) {
        this._bounces = value;
    }
    static create(id, position, angle, element) {
        const radius = Constant.Ball.Radius.Bullet;
        const mass = Constant.Ball.Mass.Bullet / Constant.Ball.Bullet.Spread_Count;
        const velocity = new Vector2(Math.cos(angle), Math.sin(angle)).multiply(Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Vector2();
        return new Bullet(id, radius, mass, position, velocity, acceleration, element);
    }
    handleMove(deltaTime, handleMoveCallback) {
        super.handleMove(deltaTime, handleMoveCallback);
    }
    addKill(target, collision) {
        if (!this._bounces) {
            this._kill += 1;
        }
        Player.getInstance().onKill(this, target, collision);
    }
}
