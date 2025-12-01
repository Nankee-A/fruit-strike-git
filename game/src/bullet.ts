import { Base, BaseType } from "./base/base.js";

export class Bullet extends Base.Ball
{
    public constructor(radius: number, mass: number, position: BaseType<"Vector2">, velocity: BaseType<"Vector2">, acceleration: BaseType<"Vector2">, handleCollisionCallback: ((ball: BaseType<"Ball">) => void) | undefined)
    {
        super(radius, mass, position, velocity, acceleration, handleCollisionCallback);
    }

    public get InScene(): boolean
    {
        return this._position.x >= 0 - this._radius
            && this._position.x <= Base.Constant.Scene.Background.Width + this._radius
            && this._position.y >= 0 - this._radius
            && this._position.y <= Base.Constant.Scene.Background.Height + this._radius;
    }

    public get IsValid(): boolean
    {
        return this.InScene && this._position.y <= Base.Constant.Scene.Mask.Y - this._radius;
    }

    public static create(position: BaseType<"Vector2">, angle: number, handleCollisionCallback: ((ball: BaseType<"Ball">) => void) | undefined = undefined)
    {
        const radius = Base.Constant.Ball.Radius.Bullet;
        const mass = Base.Constant.Ball.Mass.Bullet;
        const velocity = new Base.Vector2(Math.cos(angle), Math.sin(angle)).multiply(Base.Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Base.Vector2();

        return new Bullet(radius, mass, position, velocity, acceleration, handleCollisionCallback);
    }

    public handleCollisions(deltaTime: number): void
    {
        //Nothing TODO
    }
}