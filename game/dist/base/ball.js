import { Vector2 } from "./vector2.js";
export class Ball {
    _radius;
    _mass;
    _position;
    _velocity;
    _acceleration;
    _element;
    _collisions;
    _nextPosition;
    _nextVelocity;
    constructor(radius, mass, position, velocity, acceleration, element) {
        if (radius < 0) {
            console.warn("radius can not be less tha 0.");
        }
        this._radius = radius;
        this._mass = mass;
        this._position = position;
        this._velocity = velocity;
        this._acceleration = acceleration;
        this._element = element;
        this._collisions = [];
        this._nextPosition = new Vector2().copyFrom(position);
        this._nextVelocity = new Vector2().copyFrom(velocity);
    }
    get Radius() {
        return this._radius;
    }
    get Mass() {
        return this._mass;
    }
    get Position() {
        return this._position;
    }
    get Velocity() {
        return this._velocity;
    }
    get Acceleration() {
        return this._acceleration;
    }
    get Element() {
        return this._element;
    }
    get Collisions() {
        return this._collisions;
    }
    get NextPosition() {
        return this._nextPosition;
    }
    set NextPosition(value) {
        this._nextPosition.copyFrom(value);
    }
    get NextVelocity() {
        return this._nextVelocity;
    }
    set NextVelocity(value) {
        this._nextVelocity.copyFrom(value);
    }
    preUpdate(deltaTime, filter, ...others) {
        others.forEach(other => {
            if (filter && !filter(other)) {
                return;
            }
            const collision = this.checkCollision(deltaTime, other);
            if (collision) {
                this._collisions.push(collision);
            }
        });
    }
    lateUpdate(deltaTime, handleMoveCallback) {
        this.handleMove(deltaTime, handleMoveCallback);
        this._collisions = [];
        this._position.copyFrom(this._nextPosition);
        this._velocity.copyFrom(this._nextVelocity);
    }
    handleMove(deltaTime, handleMoveCallback) {
        this._nextPosition.add(Vector2.multiply(this._velocity, deltaTime));
        this._nextVelocity.add(Vector2.multiply(this._acceleration, deltaTime));
        handleMoveCallback?.(this);
    }
    checkCollision(deltaTime, other) {
        const dp = Vector2.subtract(other._position, this._position);
        const dv = Vector2.subtract(other._velocity, this._velocity);
        const r = other._radius + this._radius;
        const a = dv.square;
        const b = 2 * Vector2.dot(dp, dv);
        const c = dp.square - r ** 2;
        if (Math.abs(a) <= 0) {
            if (Math.abs(b) <= 0) {
                return (dp.magnitude <= r) ? { time: 0, ball: other } : undefined;
            }
            const t0 = -c / b;
            return (t0 >= 0 && t0 <= deltaTime) ? { time: t0, ball: other } : undefined;
        }
        const d = b ** 2 - (4 * a * c);
        if (d < 0) {
            return undefined;
        }
        const sqrtd = Math.sqrt(Math.max(0, d));
        const t1 = (-b - sqrtd) / (2 * a);
        const t2 = (-b + sqrtd) / (2 * a);
        var t0 = undefined;
        if (t1 >= 0 && t1 <= deltaTime) {
            t0 = t1;
        }
        if (!t0 && t2 >= 0 && t2 <= deltaTime) {
            t0 = t2;
        }
        return t0 ? { time: t0, ball: other } : undefined;
    }
}
