import { Base } from "./base/base.js";
export class Target extends Base.Ball {
    _type;
    _isHitted = false;
    constructor(radius, mass, position, velocity, acceleration, type, handleCollisionCallback) {
        super(radius, mass, position, velocity, acceleration, handleCollisionCallback);
        this._type = type;
    }
    get IsHitted() {
        return this._isHitted;
    }
    set IsHitted(value) {
        this._isHitted = value;
    }
    static create(type, handleCollisionCallback = undefined) {
        const radius = Base.JSONHelper.getByPath(Base.Constant.Ball.Radius, type) ?? Base.Constant.Ball.Radius.Default;
        const mass = Base.JSONHelper.getByPath(Base.Constant.Ball.Mass, type) ?? Base.Constant.Ball.Mass.Default;
        const position = new Base.Vector2(Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Position.X), Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Position.Y));
        const velocity = new Base.Vector2(Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Velocity.X), Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Velocity.Y));
        const acceleration = new Base.Vector2(Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Acceleration.X), Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Acceleration.Y));
        return new Target(radius, mass, position, velocity, acceleration, type, handleCollisionCallback);
    }
    handleCollisions(deltaTime) {
        if (this._collisions.length > 0) {
            this._isHitted = true;
            this._acceleration.y *= 1.5;
            this._handleCollisionCallback?.(this);
        }
    }
}
