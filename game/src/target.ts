import { Base, BaseType } from "./base/base.js";

export class Target extends Base.Ball
{
    protected _type: string;
    protected _isHitted: boolean = false;

    public constructor(radius: number, mass: number, position: BaseType<"Vector2">, velocity: BaseType<"Vector2">, acceleration: BaseType<"Vector2">, type: string, handleCollisionCallback: ((ball: BaseType<"Ball">) => void) | undefined)
    {
        super(radius, mass, position, velocity, acceleration, handleCollisionCallback);
        this._type = type;
    }

    public get IsHitted(): boolean
    {
        return this._isHitted;
    }

    public set IsHitted(value: boolean)
    {
        this._isHitted = value;
    }

    public static create(type: string, handleCollisionCallback: ((ball: BaseType<"Ball">) => void) | undefined = undefined): Target
    {
        const radius =Base.JSONHelper.getByPath(Base.Constant.Ball.Radius, type) ?? Base.Constant.Ball.Radius.Default;
        const mass = Base.JSONHelper.getByPath(Base.Constant.Ball.Mass, type) ?? Base.Constant.Ball.Mass.Default;
        const position = new Base.Vector2(
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Position.X),
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Position.Y));
        const velocity = new Base.Vector2(
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Velocity.X),
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Velocity.Y));
        const acceleration = new Base.Vector2(
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Acceleration.X),
            Base.JSONHelper.getRandomInRange(Base.Constant.Ball.Target.Acceleration.Y));
        
        return new Target(radius, mass, position, velocity, acceleration, type, handleCollisionCallback);
    }

    public handleCollisions(deltaTime: number): void
    {
        if (this._collisions.length > 0)
        {
            this._isHitted = true;
            this._acceleration.y *= 1.5;
            this._handleCollisionCallback?.(this);
        }
    }
}