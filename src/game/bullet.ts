import { Ball, Collision, Constant, Vector2 } from "./base/index.js"
import { Player } from "./player.js";
import { Target } from "./target.js";

export class Bullet extends Ball
{
    private _id: number;
    private _kill: number = 0;
    private _bounces: number = 0;

    public constructor(id: number, radius: number, mass: number, position: Vector2, velocity: Vector2, acceleration: Vector2, element?: SVGUseElement)
    {
        super(radius, mass, position, velocity, acceleration, element);
        this._id = id;
    }

    public get Id(): number
    {
        return this._id;
    }

    public get Kill(): number
    {
        return this._kill;
    }

    public get Bounces(): number
    {
        return this._bounces;
    }

    public set Bounces(value: number)
    {
        this._bounces = value;
    }

    public static create(id: number, position: Vector2, angle: number, element?: SVGUseElement)
    {
        const radius = Constant.Ball.Radius.Bullet;
        const mass = Constant.Ball.Mass.Bullet / Constant.Ball.Bullet.Spread_Count;
        const velocity = new Vector2(Math.cos(angle), Math.sin(angle)).multiply(Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Vector2();

        return new Bullet(id, radius, mass, position, velocity, acceleration, element);
    }

    protected override handleMove(deltaTime: number, handleMoveCallback: (ball: Ball) => void): void
    {
        super.handleMove(deltaTime, handleMoveCallback);
    }

    public addKill(target: Target, collision: Collision): void
    {
        if (!this._bounces)
        {
            this._kill += 1;
        }
        
        Player.getInstance().onKill(this, target, collision);
    }
}