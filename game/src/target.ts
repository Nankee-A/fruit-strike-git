import { Base, BaseType } from "./base/base.js";

export class Target extends Base.Ball
{
    protected _type: string;
    protected _isHitted: boolean = false;

    public constructor(radius: number, mass: number, position: BaseType<"Vector2">, velocity: BaseType<"Vector2">, acceleration: BaseType<"Vector2">, type: string, element: SVGUseElement)
    {
        super(radius, mass, position, velocity, acceleration, element);
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

    public static create(type: string, element: SVGUseElement): Target
    {
        const radius = Base.JSONHelper.getByPath(Base.Constant.Ball.Radius, type) ?? Base.Constant.Ball.Radius.Default;
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
        
        return new Target(radius, mass, position, velocity, acceleration, type, element);
    }

    // protected override handleCollisions(deltaTime: number): void
    // {
    //     super.handleCollisions(deltaTime);

    //     if (this._collisions.length > 0)
    //     {
    //         this._isHitted = true;
    //         this._acceleration.y *= 1.5;
    //     }
    // }

    protected override handleMove(deltaTime: number, handleMoveCallback: (ball: BaseType<"Ball">) => void): void
    {
        super.handleMove(deltaTime, handleMoveCallback);
    }
}