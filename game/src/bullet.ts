import { Base, BaseType } from "./base/base.js";

export class Bullet extends Base.Ball
{
    private _takedowns: number = 0;

    public constructor(radius: number, mass: number, position: BaseType<"Vector2">, velocity: BaseType<"Vector2">, acceleration: BaseType<"Vector2">, element: SVGUseElement)
    {
        super(radius, mass, position, velocity, acceleration, element);
    }

    public get Takedowns(): number
    {
        return this._takedowns;
    }

    public set Takedowns(value: number)
    {
        this._takedowns = value;
    }

    public static create(position: BaseType<"Vector2">, angle: number, element: SVGUseElement)
    {
        const radius = Base.Constant.Ball.Radius.Bullet;
        const mass = Base.Constant.Ball.Mass.Bullet;
        const velocity = new Base.Vector2(Math.cos(angle), Math.sin(angle)).multiply(Base.Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Base.Vector2();

        return new Bullet(radius, mass, position, velocity, acceleration, element);
    }

    protected override handleMove(deltaTime: number, handleMoveCallback: (ball: BaseType<"Ball">) => void): void
    {
        super.handleMove(deltaTime, handleMoveCallback);
    }
}