import { Ball, Constant, JSONHelper, Vector2 } from "./base/index.js";
import { Bullet } from "./bullet.js";
import { Scene } from "./scene.js";

export class Target extends Ball
{
    protected _type: string;
    protected _isHitted: boolean = false;

    public constructor(radius: number, mass: number, position: Vector2, velocity: Vector2, acceleration: Vector2, type: string, element?: SVGUseElement)
    {
        super(radius, mass, position, velocity, acceleration, element);
        this._type = type;
    }

    public get Type(): string
    {
        return this._type;
    }

    public set Type(value: string)
    {
        this._type = value;
    }

    public get IsHitted(): boolean
    {
        return this._isHitted;
    }

    public static create(type: string, element?: SVGUseElement): Target
    {
        type = type ? type : Constant.Ball.Target.Types[Math.floor(Math.random() * Constant.Ball.Target.Types.length)];
        const radius = JSONHelper.getByPath(Constant.Ball.Radius, type) ?? Constant.Ball.Radius.Default;
        const mass = JSONHelper.getByPath(Constant.Ball.Mass, type) ?? Constant.Ball.Mass.Default;
        const position = new Vector2(
            JSONHelper.getRandomInRange(Constant.Ball.Target.Position.X),
            JSONHelper.getRandomInRange(Constant.Ball.Target.Position.Y));
        const velocity = new Vector2(
            JSONHelper.getRandomInRange(Constant.Ball.Target.Velocity.X) * Math.sign(Math.random() - 0.5),
            JSONHelper.getRandomInRange(Constant.Ball.Target.Velocity.Y));
        const acceleration = new Vector2(
            JSONHelper.getRandomInRange(Constant.Ball.Target.Acceleration.X),
            JSONHelper.getRandomInRange(Constant.Ball.Target.Acceleration.Y));
        
        return new Target(radius, mass, position, velocity, acceleration, type, element);
    }

    public static copy(other: Target, type: string, element?: SVGUseElement): Target
    {
        const radius = JSONHelper.getByPath(Constant.Ball.Radius, type) ?? Constant.Ball.Radius.Default;
        const mass = JSONHelper.getByPath(Constant.Ball.Mass, type) ?? Constant.Ball.Mass.Default;
        return new Target(radius, mass, other.Position.clone(), other.Velocity.clone(), other.Acceleration.clone(), type, element);
    }

    protected override handleMove(deltaTime: number, handleMoveCallback: (ball: Ball) => void): void
    {
        this._nextVelocity.copyFrom(Vector2.add(this._velocity, Vector2.multiply(this._acceleration, deltaTime)));
        this._nextPosition.copyFrom(Vector2.add(this._position, Vector2.multiply(this._nextVelocity, deltaTime)));

        if (!this.IsHitted && this._collisions.length > 0)
        {
            this._isHitted = true;
            this._acceleration.copyFrom(new Vector2(this._acceleration.x, this._acceleration.y * Constant.Ball.Target.OnHitted.Drop));

            if (this._element)
            {
                this._element.style.filter = Constant.Ball.Target.OnHitted.Discolor;
            }

            const momentum = new Vector2();
            var totalWeight = 0;
            var avgTime = 0;
            var settled = false;

            if (!Scene.getInstance().Over)
            {
                this._collisions.sort((a, b) => a.time - b.time).forEach(collision =>
                {
                    momentum.add(Vector2.multiply(collision.ball.Velocity, collision.ball.Mass));
                    totalWeight += collision.ball.Mass;
                    avgTime += collision.time / this._collisions.length;

                    if (!settled && collision.ball instanceof Bullet)
                    {
                        collision.ball.addKill(this, collision);
                        settled = true;
                    }
                });
            }

            this._nextVelocity.add(Vector2.multiply(momentum, 1 / this._mass));
            this._nextPosition.copyFrom(Vector2.add(this._position, Vector2.multiply(this._velocity, avgTime)));
            this._nextPosition.add(Vector2.multiply(this._nextVelocity, deltaTime - avgTime));
        }

        handleMoveCallback?.(this);
    }
}