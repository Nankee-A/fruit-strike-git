import { Base, BaseType } from "./base/base.js";
import { Vector2 } from "./base/vector2.js";
import { Bullet } from "./bullet.js";
import { Player } from "./player.js";
import { Target } from "./target.js";

export class Scene extends Base.GameModule
{
    private _gameScene: Element;
    private _background: Element;
    private _mask: Element;
    private _bound: Element;
    private _bowString: Element;
    private _aimLine: Element;
    
    private _targetsContainer: Element;
    private _bulletsContainer: Element;

    private _timeCounter = 0;

    private _targets: Target[] = [];
    private _bullets: Bullet[] = [];

    private _bowStringAngle: number = 0;
    private _aimLineActive: boolean = false;
    private _aimLineAnimations: any[] = [];

    private readonly _targetTypes: string[] = Base.Constant.Ball.Target.Types;
    private readonly _boundPoints: BaseType<"Vector2">[] = [
        new Base.Vector2(Base.Constant.Scene.Bound.Min.X, Base.Constant.Scene.Bound.Min.Y),
        new Base.Vector2(Base.Constant.Scene.Bound.Min.X, Base.Constant.Scene.Bound.Max.Y),
        new Base.Vector2(Base.Constant.Scene.Bound.Max.X, Base.Constant.Scene.Bound.Max.Y),
        new Base.Vector2(Base.Constant.Scene.Bound.Max.X, Base.Constant.Scene.Bound.Min.Y)
    ];
    private readonly _bowStringPoints: BaseType<"Vector2">[] = [-1, 0, 1].map(num => new Base.Vector2(Base.Constant.Scene.Background.Width / 2 + Base.Constant.Scene.Bow_String.Length / 2 * num, Base.Constant.Scene.Bow_String.Y));

    constructor()
    {
        super();

        this._gameScene = document.querySelector("#game-scene")
            ?? (() => { throw Error("Can not find game scene.") })();
        
        this._background = this._gameScene.querySelector("#background")
            ?? (() => { throw Error("Can not find background in game scene.") })();
        
        this._mask = this._gameScene.querySelector("#mask")
            ?? (() => { throw Error("Can not find mask in game scene.") })();
        
        this._bound = this._gameScene.querySelector("#bound")
            ?? (() => { throw Error("Can not find bound in game scene.") })();
        
        this._bowString = this._gameScene.querySelector("#bow-string")?.querySelector("polyline")
            ?? (() => { throw Error("Can not find bow string in game scene.") })();
        
        this._targetsContainer = this._gameScene.querySelector("#targets-container")
            ?? (() => { throw Error("Can not find targets container in game scene.") })();
        
        this._bulletsContainer = this._gameScene.querySelector("#bullets-container")
            ?? (() => { throw Error("Can not find bullets container in game scene.") })();
        
        this._aimLine = this._gameScene.querySelector("#aim-line")
            ?? (() => { throw Error("Can not find aim line in game scene.") })();
    }

    public onInit(): void
    {
        this._setAttributes(this._gameScene,
            ["viewBox", `0 0 ${Base.Constant.Scene.Background.Width} ${Base.Constant.Scene.Background.Height}`]
        );

        this._setAttributes(this._background,
            ["fill", Base.Constant.Scene.Background.Color]
        );

        this._setAttributes(this._mask,
            ["y", Base.Constant.Scene.Mask.Y],
            ["fill", Base.Constant.Scene.Mask.Color],
            ["opacity", Base.Constant.Scene.Mask.Opacity]
        );

        this._setAttributes(this._bound,
            ["x", Base.Constant.Scene.Bound.Min.X],
            ["y", Base.Constant.Scene.Bound.Min.Y],
            ["width", Base.Constant.Scene.Bound.Max.X - Base.Constant.Scene.Bound.Min.X],
            ["height", Base.Constant.Scene.Bound.Max.Y - Base.Constant.Scene.Bound.Min.Y],
            ["fill", Base.Constant.Scene.Bound.Color],
            ["opacity", Base.Constant.Scene.Bound.Opacity]
        );

        this._setAttributes(this._bowString,
            ["points", this._getPointsString(...this._bowStringPoints)],
            ["stroke-width", Base.Constant.Scene.Bow_String.Width],
            ["stroke", Base.Constant.Scene.Bow_String.Color]
        );

        this._setAttributes(this._aimLine,
            ["stroke-width", Base.Constant.Scene.Aim_Line.Width],
            ["stroke", Base.Constant.Scene.Aim_Line.Color],
            ["opacity", 0]
        );
    }
    
    public onUpdate(deltaTime: number): void
    {
        if (this._timeCounter < Base.Constant.Game.Spawn_Target_Interval)
        {
            this._timeCounter += deltaTime;
        }
        else
        {
            this.spawnTarget();
            this._timeCounter = 0;
        }

        this._preUpdateTargets(deltaTime);
        this._preUpdateBullets(deltaTime);

        this._lateUpdateTargets(deltaTime);
        this._lateUpdateBullets(deltaTime);

        //console.info(`targets:${this._targets.length} - bullets:${this._bullets.length}`);
    }

    private _preUpdateTargets(deltaTime: number): void
    {
        for (let i = this._targets.length - 1; i >= 0; i--)
        {
            const target = this._targets[i];

            if (this._inScene(target) || (target.Position.y <= 0 - target.Radius))
            {
            }
            else
            {
                if (!target.IsHitted
                    && target.Position.y >= Base.Constant.Scene.Mask.Y + target.Radius
                    && target.Velocity.y >= 0)
                {
                    Player.getInstance().onMiss();
                }

                this._removeTarget(i);
                return;
            }

            if (!target.IsHitted)
            {
                target.preUpdate(deltaTime, (bullet) => this._inView(bullet), ...this._bullets);
            }
        }
    }

    private _preUpdateBullets(deltaTime: number): void
    {
        for (let i = this._bullets.length - 1; i >= 0; i--)
        {
            const bullet = this._bullets[i];

            if (!this._inScene(bullet))
            {
                this._removeBullet(i);
                return;
            }

            bullet.preUpdate(deltaTime);
        }
    }

    private _lateUpdateTargets(deltaTime: number): void
    {
        this._targets.forEach(target =>
        {
            target.lateUpdate(deltaTime, this._targetHandleMoveCallback.bind(this));
            this._setAttributes(target.Element,
                ["x", target.Position.x - target.Radius],
                ["y", target.Position.y - target.Radius]
            );
        });
    }

    private _lateUpdateBullets(deltaTime: number): void
    {
        this._bullets.forEach(bullet =>
        {
            bullet.lateUpdate(deltaTime, this._bulletHandleMoveCallback.bind(this));
            this._setAttributes(bullet.Element,
                ["x", bullet.Position.x - bullet.Radius],
                ["y", bullet.Position.y - bullet.Radius]
            );
        });
    }

    private _targetHandleMoveCallback(ball: BaseType<"Ball">): BaseType<"Vector2"> | void
    {
        if (ball instanceof Target)
        {
            const target = ball as Target;

            if (!target.IsHitted && target.Collisions.length > 0)
            {
                target.IsHitted = true;
                if (target.Element)
                {
                    target.Element.style.filter = "saturate(0)";
                }
            }

            if (Base.Vector2.segmentDistance(target.Position, target.NextPosition, this._boundPoints[0], this._boundPoints[1]) <= target.Radius)
            {
                target.NextPosition.copyFrom(new Vector2((this._boundPoints[0].x + target.Radius) * 2 - target.NextPosition.x, target.NextPosition.y));
            }
            else if(Base.Vector2.segmentDistance(target.Position, target.NextPosition, this._boundPoints[2], this._boundPoints[3]) <= target.Radius)
            {
                target.NextPosition.copyFrom(new Vector2((this._boundPoints[2].x - target.Radius) * 2 - target.NextPosition.x, target.NextPosition.y));
            }
            else
            {
                return;
            }

            target.NextVelocity.flipX();
            target.Acceleration.flipX();
        }
    }

    private _bulletHandleMoveCallback(ball: BaseType<"Ball">): BaseType<"Vector2"> | void
    {
        return;
        
        if (ball instanceof Bullet)
        {
            const bullet = ball as Bullet;
        }
    }

    public spawnTarget(): void
    {
        var targetType = this._targetTypes[Math.floor(Math.random() * this._targetTypes.length)];
        const targetElement = document.createElementNS("http://www.w3.org/2000/svg", "use");

        const target = Target.create(targetType, targetElement);

        const typeSymbolElement = document.getElementById(targetType.toLowerCase());
        if (!typeSymbolElement)
        {
            targetType = "default";
        }
        targetElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${targetType.toLowerCase()}`);

        this._setAttributes(targetElement,
            ["class", "target"],
            ["width", target.Radius * 2],
            ["height", target.Radius * 2],
            ["x", target.Position.x - target.Radius],
            ["y", target.Position.y - target.Radius]
        );

        this._targetsContainer.appendChild(targetElement);
        this._targets.push(target);
    }

    private _removeTarget(index: number): void
    {
        const target = this._targets[index];
        this._targets.splice(index, 1);
        if (target)
        {
            this._targetsContainer.removeChild(target.Element);
        }
    }

    public spawnBullet(position: BaseType<"Vector2">, angle: number): void
    {
        const bulletElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        const bullet = Bullet.create(position, angle, bulletElement);

        bulletElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#bullet");

        this._setAttributes(bulletElement,
            ["class", "bullet"],
            ["width", bullet.Radius * 2],
            ["height", bullet.Radius * 2],
            ["x", bullet.Position.x - bullet.Radius],
            ["y", bullet.Position.y - bullet.Radius]
        )

        this._bulletsContainer.appendChild(bulletElement);
        this._bullets.push(bullet);
    }

    private _removeBullet(index: number): void
    {
        const bullet = this._bullets[index];
        this._bullets.splice(index, 1);
        if (bullet)
        {
            this._bulletsContainer.removeChild(bullet.Element);
        }
    }

    public setBowString(drawed: boolean, angle: number = -0.5 * Math.PI, stretch: number = 0)
    {
        var newAngle = angle;
        var newStretch = stretch;

        if (!drawed)
        {
            newAngle = this._bowStringAngle;
            newStretch = 0;
        }
        else
        {
            this._bowStringAngle = newAngle;
        }

        const p0 = Base.Vector2.rotate(this._bowStringPoints[0], this._bowStringPoints[1], (newAngle - 0.5 * Math.PI) / 2);
        const p2 = Base.Vector2.rotate(this._bowStringPoints[2], this._bowStringPoints[1], (newAngle - 0.5 * Math.PI) / 2);

        const p1 = Base.Vector2.add(this._bowStringPoints[1], new Base.Vector2(Math.cos(newAngle), Math.sin(newAngle)).multiply(newStretch));

        Base.Animator.to("#bow-string polyline", Base.Constant.Animation.Aim_Duration,
            {
                attr:
                {
                    points: this._getPointsString(p0, p1, p2)
                }
            },
            false, !drawed);
    }

    public setAimLine(active: boolean = false, angle: number = -0.5 * Math.PI, stretch: number = 0)
    {
        if (!active)
        {
            this._setAttributes(this._aimLine,
                ["opacity", 0]
            );

            while (this._aimLineAnimations.length > 0)
            {
                Base.Animator.kill(this._aimLineAnimations.pop());
            }

            this._aimLineActive = active;
            return;
        }

        const pFrom = Base.Vector2.add(this._bowStringPoints[1], new Base.Vector2(Math.cos(angle), Math.sin(angle)).multiply(stretch));
        const pTo = Base.Vector2.add(pFrom, new Base.Vector2(Math.cos(angle + Math.PI), Math.sin(angle + Math.PI)).multiply(Base.Constant.Scene.Aim_Line.Length));

        if (!this._aimLineActive)
        {
            this._setAttributes(this._aimLine,
                ["x1", pFrom.x],
                ["y1", pFrom.y],
                ["x2", pTo.x],
                ["y2", pTo.y]
            );

            this._aimLineAnimations.push(Base.Animator.to("#aim-line", Base.Constant.Animation.Aim_Duration,
                {
                    attr:
                    {
                        opacity: Base.Constant.Scene.Aim_Line.Opacity
                    }
                }, false, false
            ));

            this._aimLineActive = active;
            return;
        }

        this._aimLineAnimations.push(Base.Animator.to("#aim-line", Base.Constant.Animation.Aim_Duration,
            {
                attr:
                {
                    x1: pFrom.x,
                    y1: pFrom.y,
                    x2: pTo.x,
                    y2: pTo.y
                }
            }, false, false
        ));
    }

    private _setAttributes(element: Element | null | undefined, ...kvps: [string, any][]): void
    {
        if (!element)
        {
            throw new Error("Element is invalid.");
        }

        kvps.forEach(kvp =>
        {
            element.setAttribute(kvp[0], `${kvp[1]}`);
        })
    }

    private _getPointsString(...vectors: BaseType<"Vector2">[]): string
    {
        const points = vectors.map(vector => `${vector.x},${vector.y}`);
        return points.join(" ");
    }

    private _inScene(ball: BaseType<"Ball">): boolean
    {
        return ball.Position.x >= 0 - ball.Radius
            && ball.Position.x <= Base.Constant.Scene.Background.Width + ball.Radius
            && ball.Position.y >= 0 - ball.Radius
            && ball.Position.y <= Base.Constant.Scene.Background.Height + ball.Radius;
    }

    private _inView(ball: BaseType<"Ball">): boolean
    {
        return this._inScene(ball) && ball.Position.y <= Base.Constant.Scene.Mask.Y - ball.Radius;
    }
}