import { Vector2 } from "./vector2.js";
export class Ball {
    _radius;
    _mass;
    _position;
    _velocity;
    _acceleration;
    _nextPosition;
    _collisions;
    _handleCollisionCallback;
    constructor(radius, mass, position, velocity, acceleration, handleCollisionCallback) {
        if (radius < 0) {
            console.warn("radius can not be less tha 0.");
        }
        this._radius = radius;
        this._mass = mass;
        this._position = position;
        this._velocity = velocity;
        this._acceleration = acceleration;
        this._nextPosition = new Vector2().copyFrom(position);
        this._collisions = [];
        this._handleCollisionCallback = handleCollisionCallback;
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
    get NextPosition() {
        return this._nextPosition;
    }
    get Collisions() {
        return this._collisions;
    }
    get HandleCollisionCallback() {
        return this._handleCollisionCallback;
    }
    set HandleCollisionCallback(value) {
        this._handleCollisionCallback = value;
    }
    preUpdate(deltaTime) {
        const deltaPosition = Vector2.multiply(this._velocity, deltaTime);
        this._nextPosition.copyFrom(Vector2.add(this._position, deltaPosition));
    }
    checkCollision(other) {
        const distance = this.movingDistanceToSegment(other._position, other._nextPosition);
        if (distance <= this._radius + other._radius) {
            const ballInfo = {
                radius: other._radius,
                mass: other._mass,
                position: other._position,
                velocity: other._velocity,
                acceleration: other._acceleration
            };
            this._collisions.push(ballInfo);
        }
    }
    lateUpdate(deltaTime) {
        this.handleCollisions(deltaTime);
        this._collisions = [];
        this._position.copyFrom(this._nextPosition);
        this._velocity.add(Vector2.multiply(this._acceleration, deltaTime));
    }
    distanceToSegment(p1, p2) {
        return this._position.distanceToSegment(p1, p2) - this._radius;
    }
    movingDistanceToSegment(p1, p2) {
        return this._segmentDistance(this._position, this._nextPosition, p1, p2);
    }
    _segmentDistance(p1, p2, p3, p4) {
        if (this._doSegmentIntersect(p1, p2, p3, p4)) {
            return 0;
        }
        const distances = [
            p1.distanceToSegment(p3, p4),
            p2.distanceToSegment(p3, p4),
            p3.distanceToSegment(p1, p2),
            p4.distanceToSegment(p1, p2)
        ];
        return Math.min(...distances);
    }
    _doSegmentIntersect(p1, p2, p3, p4) {
        const c1 = Vector2.subtract(p4, p3).cross(Vector2.subtract(p1, p3));
        const c2 = Vector2.subtract(p4, p3).cross(Vector2.subtract(p2, p3));
        const c3 = Vector2.subtract(p2, p1).cross(Vector2.subtract(p3, p1));
        const c4 = Vector2.subtract(p2, p1).cross(Vector2.subtract(p4, p1));
        return (c1 * c2 <= 0) && (c3 * c4 <= 0);
    }
}
