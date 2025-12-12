import { Vector2 } from "./vector2.js";

export type Collision =
    {
        time: number,
        point:Vector2,
        ball: Ball
    }

export abstract class Ball
{
    protected _radius: number;
    protected _mass: number;

    protected _position: Vector2;
    protected _velocity: Vector2;
    protected _acceleration: Vector2;

    protected _element?: SVGUseElement;
    
    protected _collisions: Collision[];

    protected _nextPosition: Vector2;
    protected _nextVelocity: Vector2;

    public constructor(radius: number, mass: number, position: Vector2, velocity: Vector2, acceleration: Vector2, element?: SVGUseElement)
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

        this._element = element;
        
        this._collisions = [];
        this._nextPosition = new Vector2().copyFrom(position);
        this._nextVelocity = new Vector2().copyFrom(velocity);
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

    public get Element(): SVGUseElement | undefined
    {
        return this._element;
    }

    public get Collisions(): Collision[]
    {
        return this._collisions;
    }

    public get NextPosition(): Vector2
    {
        return this._nextPosition;
    }

    public set NextPosition(value: Vector2)
    {
        this._nextPosition.copyFrom(value);
    }

    public get NextVelocity(): Vector2
    {
        return this._nextVelocity;
    }

    public set NextVelocity(value: Vector2)
    {
        this._nextVelocity.copyFrom(value);
    }

    public preUpdate(deltaTime: number, filter?: (ball: Ball) => boolean, ...others: Ball[]): void
    {
        others.forEach(other =>
        {
            if (filter && !filter(other))
            {
                return;
            }

            const collision = this.checkCollision(deltaTime, other);
            if (collision)
            {
                this._collisions.push(collision);
            }
        });
    }

    public lateUpdate(deltaTime: number, handleMoveCallback: (ball: Ball) => void): void
    {
        this.handleMove(deltaTime, handleMoveCallback);
        this._collisions = [];

        this._position.copyFrom(this._nextPosition);
        this._velocity.copyFrom(this._nextVelocity);
    }

    protected handleMove(deltaTime: number, handleMoveCallback: (ball: Ball) => void): void
    {
        this._nextVelocity.copyFrom(Vector2.add(this._velocity, Vector2.multiply(this._acceleration, deltaTime)));
        this._nextPosition.copyFrom(Vector2.add(this._position, Vector2.multiply(this._nextVelocity, deltaTime)));
        handleMoveCallback?.(this);
    }

    private checkCollision(deltaTime: number, other: Ball): Collision | undefined
    {
        const dp = Vector2.subtract(other._position, this._position);
        const dv = Vector2.subtract(other._velocity, this._velocity);
        const r = other._radius + this._radius;

        const a = dv.square;
        const b = 2 * Vector2.dot(dp, dv);
        const c = dp.square - r ** 2;

        if (Math.abs(a) <= 0)
        {
            if (Math.abs(b) <= 0)
            {
                return (dp.magnitude <= r) ? { time: 0, point: this._getCollisionPoint(0, other), ball: other } : undefined;
            }

            const t0 = -c / b;
            return (t0 >= 0 && t0 <= deltaTime) ? { time: t0, point: this._getCollisionPoint(t0, other), ball: other } : undefined;
        }

        const d = b ** 2 - (4 * a * c);

        if (d < 0)
        {
            return undefined;
        }

        const sqrtd = Math.sqrt(Math.max(0, d));
        const t1 = (-b - sqrtd) / (2 * a);
        const t2 = (-b + sqrtd) / (2 * a);

        var t0 = undefined;

        if (t1 >= 0 && t1 <= deltaTime)
        {
            t0 = t1;
        }

        if (!t0 && t2 >= 0 && t2 <= deltaTime)
        {
            t0 = t2;
        }

        return t0 ? { time: t0, point: this._getCollisionPoint(t0, other), ball: other } : undefined;
    }

    private _getCollisionPoint(time: number, other: Ball): Vector2
    {
        const pThis = Vector2.add(this._position, Vector2.multiply(this._velocity, time));
        const pOther = Vector2.add(other._position, Vector2.multiply(other._velocity, time));

        const collisionPointX = (pThis.x * other._radius + pOther.x * this._radius) / (this._radius + other._radius);
        const collisionPointY = (pThis.y * other._radius + pOther.y * this._radius) / (this._radius + other._radius);

        return new Vector2(collisionPointX, collisionPointY);
    }
}