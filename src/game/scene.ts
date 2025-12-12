import { Animator, Ball, Constant, GameModule, SVGHelper, Vector2 } from "./base/index.js";
import { Bullet } from "./bullet.js";
import { Player } from "./player.js";
import { Target } from "./target.js";

export class Scene extends GameModule
{
    private _gameScene: Element;
    private _background: Element;
    private _mask: Element;
    private _bound: Element;
    private _totalScoreElement: Element;
    private _totalKillElement: Element;
    private _totalScoreContent: Element;
    private _totalKillContent: Element;
    private _bowString: Element;
    private _aimLine: Element;
    private _overElement: Element;
    private _upgradeEffect: Element;

    private _scoreContainer: Element;
    
    private _targetsContainer: Element;
    private _bulletsContainer: Element;

    private _healthContainer: Element;

    private _hitEffectContainer: Element;

    private _timeCounter = 0;
    private _continuous = false;
    private _templateTarget?: Target;

    private _targets: Target[] = [];

    private _bullets: Bullet[] = [];
    private _bulletGroups: Map<number, Bullet[]> = new Map<number, Bullet[]>;

    private _bowStringAngle: number = 0;
    private _aimLineAnimations: any[] = [];
    private _maskBlinkAnimations: any[] = [];
    private _upgradeEffectAnimation: any;

    private _over: boolean = false;

    private readonly _boundPoints: Vector2[] = [
        new Vector2(Constant.Scene.Bound.Min.X, Constant.Scene.Bound.Min.Y),
        new Vector2(Constant.Scene.Bound.Min.X, Constant.Scene.Bound.Max.Y),
        new Vector2(Constant.Scene.Bound.Max.X, Constant.Scene.Bound.Max.Y),
        new Vector2(Constant.Scene.Bound.Max.X, Constant.Scene.Bound.Min.Y)
    ];
    private readonly _bowStringPoints: Vector2[] = [-1, 0, 1].map(num => new Vector2(Constant.Scene.Background.Width / 2 + Constant.Scene.Bow_String.Length / 2 * num, Constant.Scene.Bow_String.Y));

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
        
        this._totalScoreElement = this._gameScene.querySelector("#total-score")
            ?? (() => { throw Error("Can not find score in game scene.") })();
        
        this._totalKillElement = this._gameScene.querySelector("#total-kill")
            ?? (() => { throw Error("Can not find kill in game scene.") })();
        
        this._totalScoreContent = this._totalScoreElement.querySelector(".content")
            ?? (() => { throw Error("Can not find score content in score element.") })();
        
        this._totalKillContent = this._totalKillElement.querySelector(".content")
            ?? (() => { throw Error("Can not find kill content in kill element.") })();
        
        this._bowString = this._gameScene.querySelector("#bow-string")?.querySelector("polyline")
            ?? (() => { throw Error("Can not find bow string in game scene.") })();
        
        this._targetsContainer = this._gameScene.querySelector("#targets-container")
            ?? (() => { throw Error("Can not find targets container in game scene.") })();
        
        this._bulletsContainer = this._gameScene.querySelector("#bullets-container")
            ?? (() => { throw Error("Can not find bullets container in game scene.") })();
        
        this._aimLine = this._gameScene.querySelector("#aim-line")
            ?? (() => { throw Error("Can not find aim line in game scene.") })();
        
        this._overElement = this._gameScene.querySelector("#over")
            ?? (() => { throw Error("Can not find over element in game scene.") })();
        
        this._scoreContainer = this._gameScene.querySelector("#score-container")
            ?? (() => { throw Error("Can not find score container in game scene.") })();
        
        this._healthContainer = this._gameScene.querySelector("#health-container")
            ?? (() => { throw Error("Can not find health container in game scene.") })();
        
        this._upgradeEffect = this._gameScene.querySelector("#upgrade-effect")
            ?? (() => { throw Error("Can not find upgrade effect in game scene.") })();
        
        this._hitEffectContainer = this._gameScene.querySelector("#hit-effect-container")
            ?? (() => { throw Error("Can not find hit effect container in game scene.") })();
    }

    public get Over(): boolean
    {
        return this._over;
    }

    public override async onInit(): Promise<void>
    {
        await SVGHelper.Preload(...Constant.Ball.Target.Types.map(type => `./images/${type.toLowerCase()}.svg`));

        this._setAttributes(this._gameScene,
            ["viewBox", `0 0 ${Constant.Scene.Background.Width} ${Constant.Scene.Background.Height}`]
        );

        this._setAttributes(this._background,
            ["fill", Constant.Scene.Background.Color]
        );

        this._setAttributes(this._mask,
            ["y", Constant.Scene.Mask.Y],
            ["fill", Constant.Scene.Mask.Color],
            ["opacity", Constant.Scene.Mask.Opacity]
        );

        this._setAttributes(this._bound,
            ["x", Constant.Scene.Bound.Min.X],
            ["y", Constant.Scene.Bound.Min.Y],
            ["width", Constant.Scene.Bound.Max.X - Constant.Scene.Bound.Min.X],
            ["height", Constant.Scene.Bound.Max.Y - Constant.Scene.Bound.Min.Y],
            ["fill", Constant.Scene.Bound.Color],
            ["opacity", Constant.Scene.Bound.Opacity]
        );

        this._setAttributes(this._totalScoreElement,
            ["fill", Constant.Scene.UI.Total_Score.Color],
            ["font-size", Constant.Scene.UI.Total_Score.Font_Size]
        );
            
        this._setAttributes(this._totalKillElement,
            ["fill", Constant.Scene.UI.Total_Score.Color],
            ["font-size", Constant.Scene.UI.Total_Score.Font_Size]
        );

        this._setAttributes(this._totalScoreElement.querySelector(".title"),
            ["x", Constant.Scene.UI.Total_Score.Title.X],
            ["y", Constant.Scene.UI.Total_Score.Title.Y]
        );

        this._setAttributes(this._totalKillElement.querySelector(".title"),
            ["x", Constant.Scene.UI.Total_Kill.Title.X],
            ["y", Constant.Scene.UI.Total_Kill.Title.Y]
        );

        this._setAttributes(this._totalScoreContent,
            ["x", Constant.Scene.UI.Total_Score.Title.X + Constant.Scene.UI.Total_Score.Content.X],
            ["y", Constant.Scene.UI.Total_Score.Title.Y + Constant.Scene.UI.Total_Score.Content.Y]
        );

        this._setAttributes(this._totalKillContent,
            ["x", Constant.Scene.UI.Total_Kill.Title.X + Constant.Scene.UI.Total_Kill.Content.X],
            ["y", Constant.Scene.UI.Total_Kill.Title.Y + Constant.Scene.UI.Total_Kill.Content.Y]
        );

        this._setAttributes(this._bowString,
            ["points", this._toPointsString(...this._bowStringPoints)],
            ["stroke-width", Constant.Scene.Bow_String.Width],
            ["stroke", Constant.Scene.Bow_String.Color]
        );

        this._setAttributes(this._aimLine,
            ["stroke-width", Constant.Scene.Aim_Line.Width],
            ["stroke", Constant.Scene.Aim_Line.Color],
            ["opacity", 0]
        );

        this._setAttributes(this._overElement.querySelector(".content"),
            ["fill", Constant.Scene.UI.Over.Color],
            ["font-size", Constant.Scene.UI.Over.Font_Size]
        );

        var x: number = Constant.Scene.UI.Health.X - Constant.Scene.UI.Health.Radius * 2;
        for (let i = 0; i < Constant.Game.Health; i++)
        {
            const healthElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
            healthElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#health");
            this._setAttributes(healthElement,
                ["x", x],
                ["y", Constant.Scene.UI.Health.Y],
                ["width", Constant.Scene.UI.Health.Radius * 2],
                ["height", Constant.Scene.UI.Health.Radius * 2]
            );
            this._healthContainer.append(healthElement);

            x -= Constant.Scene.UI.Health.Space + Constant.Scene.UI.Health.Radius * 2;
        }

        this._resetUpgradeEffect();
    }
    
    public onUpdate(deltaTime: number): void
    {
        if (!this._continuous)
        {
            if (this._timeCounter < Constant.Game.Target.Spawn_Interval)
            {
                this._timeCounter += deltaTime;
            }
            else
            {
                this._continuous = Math.random() < Constant.Game.Target.Continuous_Probability;
                this.spawnTarget();
                this._timeCounter = 0;
            }
        }
        else
        {
            if (this._timeCounter < Constant.Game.Target.Spawn_Continuous_Interval)
            {
                this._timeCounter += deltaTime;
            }
            else
            {
                this.spawnTarget();
                this._continuous = Math.random() < Constant.Game.Target.Continuous_Probability;
                this._timeCounter = 0;
            }
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

            if (this._inScene(target) && (target.Position.y <= Constant.Scene.Mask.Y + target.Radius)
                || (target.Position.y <= 0 - target.Radius))
            {
            }
            else
            {
                if (!target.IsHitted && target.Velocity.y >= 0 && !this._over)
                {
                    const health = Player.getInstance().onHurt();
                    while (this._healthContainer.children.length > health && this._healthContainer.lastChild)
                    {
                        this._healthContainer.removeChild(this._healthContainer.lastChild);
                    }
                    this._blinkMask();
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

    private _targetHandleMoveCallback(ball: Ball): void
    {
        if (ball instanceof Target)
        {
            const target = ball as Target;

            if (Vector2.segmentLineDistance(target.Position, target.NextPosition, this._boundPoints[0], this._boundPoints[1]) <= target.Radius * Constant.Ball.Elasticity)
            {
                target.NextPosition.copyFrom(new Vector2((this._boundPoints[0].x + target.Radius * Constant.Ball.Elasticity) * 2 - target.NextPosition.x, target.NextPosition.y));
            }
            else if (Vector2.segmentLineDistance(target.Position, target.NextPosition, this._boundPoints[2], this._boundPoints[3]) <= target.Radius * Constant.Ball.Elasticity)
            {
                target.NextPosition.copyFrom(new Vector2((this._boundPoints[2].x - target.Radius * Constant.Ball.Elasticity) * 2 - target.NextPosition.x, target.NextPosition.y));
            }
            else
            {
                return;
            }

            target.NextVelocity.flipX();
            target.Acceleration.flipX();
        }
    }

    private _bulletHandleMoveCallback(ball: Ball): void
    {
        if (ball instanceof Bullet)
        {
            const bullet = ball as Bullet;

            if (Vector2.segmentLineDistance(bullet.Position, bullet.NextPosition, this._boundPoints[0], this._boundPoints[1]) <= bullet.Radius * Constant.Ball.Elasticity)
            {
                bullet.NextPosition.copyFrom(new Vector2((this._boundPoints[0].x + bullet.Radius * Constant.Ball.Elasticity) * 2 - bullet.NextPosition.x, bullet.NextPosition.y));
            }
            else if (Vector2.segmentLineDistance(bullet.Position, bullet.NextPosition, this._boundPoints[2], this._boundPoints[3]) <= bullet.Radius * Constant.Ball.Elasticity)
            {
                bullet.NextPosition.copyFrom(new Vector2((this._boundPoints[2].x - bullet.Radius * Constant.Ball.Elasticity) * 2 - bullet.NextPosition.x, bullet.NextPosition.y));
            }
            else
            {
                return;
            }

            bullet.NextVelocity.flipX();
            bullet.Acceleration.flipX();
            bullet.Bounces += 1;
        }
    }

    public spawnTarget(): void
    {
        const targetType = Constant.Ball.Target.Types[Math.floor(Math.random() * Constant.Ball.Target.Types.length)];

        if (!this._continuous || !this._templateTarget)
        {
            this._templateTarget = Target.create(targetType);
        }

        const targetElement = SVGHelper.createUseElement(`./images/${targetType.toLowerCase()}.svg`);
        const target = this._continuous ? Target.copy(this._templateTarget, targetType, targetElement) : Target.create(targetType, targetElement);

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
        if (target && target.Element)
        {
            this._targetsContainer.removeChild(target.Element);
        }
    }

    public spawnBullet(id: number, position: Vector2, angle: number): void
    {
        const bulletElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
        const bullet = Bullet.create(id, position, angle, bulletElement);

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

        var group = this._bulletGroups.get(id);
        if (!group)
        {
            group = [];
            this._bulletGroups.set(id, group);
        }

        group.push(bullet);
    }

    private _removeBullet(index: number): void
    {
        const bullet = this._bullets[index];
        this._bullets.splice(index, 1);
        if (bullet && bullet.Element)
        {
            this._bulletsContainer.removeChild(bullet.Element);
        }

        var group = this._bulletGroups.get(bullet.Id);
        if (group)
        {
            group = group.filter((b) => !(b === bullet));
            if (group.length > 0)
            {
                this._bulletGroups.set(bullet.Id, group);
            }
            else
            {
                this._bulletGroups.delete(bullet.Id);
            }
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

        const p0 = Vector2.rotate(this._bowStringPoints[0], this._bowStringPoints[1], (newAngle - 0.5 * Math.PI) / 2);
        const p2 = Vector2.rotate(this._bowStringPoints[2], this._bowStringPoints[1], (newAngle - 0.5 * Math.PI) / 2);

        const p1 = Vector2.add(this._bowStringPoints[1], new Vector2(Math.cos(newAngle), Math.sin(newAngle)).multiply(newStretch));

        Animator.to(this._bowString, Constant.Scene.Bow_String.Aim_Duration,
            {
                attr:
                {
                    points: this._toPointsString(p0, p1, p2)
                }
            },
            false, !drawed);
    }

    public setAimLine(active: boolean = false, angle: number = -0.5 * Math.PI, stretch: number = 0)
    {
        if (!active)
        {
            this._setAttributes(this._aimLine,
                ["x1", this._bowStringPoints[1].x],
                ["y1", this._bowStringPoints[1].y],
                ["x2", this._bowStringPoints[1].x],
                ["y2", this._bowStringPoints[1].y],
                ["opacity", 0]
            );

            while (this._aimLineAnimations.length > 0)
            {
                Animator.kill(this._aimLineAnimations.pop());
            }

            return;
        }

        const pFrom = Vector2.add(this._bowStringPoints[1], new Vector2(Math.cos(angle), Math.sin(angle)).multiply(stretch));
        const pTo = Vector2.add(pFrom, new Vector2(Math.cos(angle + Math.PI), Math.sin(angle + Math.PI)).multiply(Constant.Scene.Aim_Line.Length));

        this._aimLineAnimations.push(Animator.to(this._aimLine, Constant.Scene.Bow_String.Aim_Duration,
            {
                attr:
                {
                    x1: pFrom.x,
                    y1: pFrom.y,
                    x2: pTo.x,
                    y2: pTo.y,
                    opacity: Constant.Scene.Aim_Line.Opacity
                }
            }, false, false
        ));
    }

    public getGroupKill(bullet: Bullet): number
    {
        const group = this._bulletGroups.get(bullet.Id);
        var groupKill = 0;
        if (group)
        {
            group.forEach(b =>
            {
                groupKill += b.Kill;
            });
        }

        return groupKill;
    }

    public setUI(score: number, kill: number)
    {
        this._totalScoreContent.textContent = `${score}`;
        this._totalKillContent.textContent = `${kill}`;
    }

    public setScore(score: number, position: Vector2)
    {
        const scoreElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        scoreElement.textContent = `+${score}`;
        this._setAttributes(scoreElement,
            ["class", "score"],
            ["fill", Constant.Scene.UI.Score.Color],
            ["font-size", Constant.Scene.UI.Score.Font_Size],
            ["style", "user-select: none; -webkit-user-select: none;"],
            ["opacity", 1],
            ["x", position.x],
            ["y", position.y]
        );

        this._scoreContainer.appendChild(scoreElement);
        
        Animator.to(scoreElement, 1,
            {
                attr:
                {
                    opacity: 0,
                    x: position.x + Constant.Scene.UI.Score.Offset.X,
                    y: position.y + Constant.Scene.UI.Score.Offset.Y
                },
                onComplete: () =>
                {
                    this._scoreContainer.removeChild(scoreElement)
                }
            });
    }

    public onGameOver(): void
    {
        this._over = true;
        this._setAttributes(this._overElement,
            ["opacity", 1]
        );
    }

    public makeHitEffect(position: Vector2): void
    {
        const effectElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this._setAttributes(effectElement,
            ["class", "hit-effect"],
            ["cx", position.x],
            ["cy", position.y],
            ["fill", Constant.Scene.Effect.Hit.Color],
            ["opacity", 1],
            ["r", 0]
        );

        this._hitEffectContainer.appendChild(effectElement);

        Animator.to(effectElement, Constant.Scene.Effect.Hit.Duration,
            {
                attr:
                {
                    opacity: 0,
                    r: Constant.Scene.Effect.Hit.Radius
                },
                onComplete: () =>
                {
                    this._hitEffectContainer.removeChild(effectElement)
                }
            }
        );
    }

    public makeUpgradeEffect(color: String): void
    {
        if (this._upgradeEffectAnimation)
        {
            Animator.kill(this._upgradeEffectAnimation);
            this._resetUpgradeEffect();
        }

        this._setAttributes(this._upgradeEffect,
            ["fill", color]
        );

        this._upgradeEffectAnimation = Animator.to(this._upgradeEffect, Constant.Scene.Effect.Upgrade.Duration,
            {
                attr:
                {
                    opacity: 0,
                    r: Constant.Scene.Effect.Upgrade.Radius
                },
                onComplete: () =>
                {
                    this._resetUpgradeEffect();
                }
            });
    }

    private _resetUpgradeEffect(): void
    {
        this._setAttributes(this._upgradeEffect,
            ["cx", Constant.Scene.Background.Width / 2],
            ["cy", Constant.Scene.Bow_String.Y],
            ["r", 0],
            ["opacity", 1]
        );
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

    private _toPointsString(...vectors: Vector2[]): string
    {
        const points = vectors.map(vector => `${vector.x},${vector.y}`);
        return points.join(" ");
    }

    private _inScene(ball: Ball): boolean
    {
        return ball.Position.x >= 0 - ball.Radius
            && ball.Position.x <= Constant.Scene.Background.Width + ball.Radius
            && ball.Position.y >= 0 - ball.Radius
            && ball.Position.y <= Constant.Scene.Background.Height + ball.Radius;
    }

    private _inView(ball: Ball): boolean
    {
        return this._inScene(ball) && ball.Position.y <= Constant.Scene.Mask.Y - ball.Radius;
    }

    private _blinkMask(): void
    {
        while (this._maskBlinkAnimations.length > 0)
        {
            Animator.kill(this._maskBlinkAnimations.pop());
        }

        this._maskBlinkAnimations.push(Animator.to(this._mask, Constant.Scene.Mask.OnMiss.Duration,
            {
                attr:
                {
                    fill: Constant.Scene.Mask.OnMiss.Color
                },
                repeat: Constant.Scene.Mask.OnMiss.Repeat,
                yoyo: true,
                onComplete: () =>
                {
                    Animator.set(this._mask,
                        {
                            attr:
                            {
                                fill: Constant.Scene.Mask.Color
                            }
                        });
                }
            }));
    }
}