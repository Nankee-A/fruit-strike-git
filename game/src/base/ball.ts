import { Vector2 } from "./vector2.js";

type BallInfo =
{
    radius: number,
    mass: number,
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2
}

export abstract class Ball
{
    protected _radius: number;
    protected _mass: number;
    protected _position: Vector2;
    protected _velocity: Vector2;
    protected _acceleration: Vector2;

    protected _nextPosition: Vector2;
    protected _collisions: BallInfo[];

    protected _handleCollisionCallback?: (ball: Ball) => void;

    public constructor(radius: number, mass: number, position: Vector2, velocity: Vector2, acceleration: Vector2, handleCollisionCallback: ((ball: Ball) => void) | undefined)
    {
        if (radius < 0)
        {
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

    public get Radius(): number
    {
        return this._radius;
    }

    public get Mass(): number
    {
        return this._mass;
    }

    public get Position(): Vector2
    {
        return this._position;
    }

    public get Velocity(): Vector2
    {
        return this._velocity;
    }

    public get Acceleration(): Vector2
    {
        return this._acceleration;
    }

    public get NextPosition(): Vector2
    {
        return this._nextPosition;
    }

    public get Collisions(): BallInfo[]
    {
        return this._collisions;
    }

    public get HandleCollisionCallback(): ((ball: Ball) => void) | undefined
    {
        return this._handleCollisionCallback;
    }

    public set HandleCollisionCallback(value: ((ball: Ball) => void) | undefined)
    {
        this._handleCollisionCallback = value;
    }

    public preUpdate(deltaTime: number)
    {
        const deltaPosition = Vector2.multiply(this._velocity, deltaTime);
        this._nextPosition.copyFrom(Vector2.add(this._position, deltaPosition));
    }
    
    public checkCollision(other: Ball): void
    {
        const distance = this.movingDistanceToSegment(other._position, other._nextPosition);
        if (distance <= this._radius + other._radius)
        {
            const ballInfo: BallInfo = {
                radius: other._radius,
                mass: other._mass,
                position: other._position,
                velocity: other._velocity,
                acceleration: other._acceleration
            };
            this._collisions.push(ballInfo);
        }
    }

    public lateUpdate(deltaTime: number)
    {
        this.handleCollisions(deltaTime);
        this._collisions = [];

        this._position.copyFrom(this._nextPosition);
        this._velocity.add(Vector2.multiply(this._acceleration, deltaTime));
    }

    public abstract handleCollisions(deltaTime: number): void;

    public distanceToSegment(p1: Vector2, p2: Vector2): number
    {
        return this._position.distanceToSegment(p1, p2) - this._radius;
    }

    public movingDistanceToSegment(p1: Vector2, p2: Vector2): number
    {
        return this._segmentDistance(this._position, this._nextPosition, p1, p2);
    }

    private _segmentDistance(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): number
    {
        if (this._doSegmentIntersect(p1, p2, p3, p4))
        {
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

    private _doSegmentIntersect(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): boolean
    {
        const c1: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p1, p3));
        const c2: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p2, p3));
        const c3: number = Vector2.subtract(p2, p1).cross(Vector2.subtract(p3, p1));
        const c4: number = Vector2.subtract(p2, p1).cross(Vector2.subtract(p4, p1));

        return (c1 * c2 <= 0) && (c3 * c4 <= 0);
    }
}