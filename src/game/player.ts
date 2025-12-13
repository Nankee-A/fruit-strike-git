import { PlayerData, PlayerDataManager } from "../core/playerDataManager.js";
import { Collision, Constant, GameModule, JSONHelper, Utility, Vector2 } from "./base/index.js";
import { Bullet } from "./bullet.js";
import { Scene } from "./scene.js";
import { Target } from "./target.js";

export class Player extends GameModule
{
    private _svg: SVGSVGElement;
    private _cursor: DOMPoint;

    private _startPosition: Vector2;
    private _currentPosition: Vector2;

    private _isAiming: boolean = false;
    private _inRange: boolean = false;

    private _aimOffset: Vector2 = new Vector2();

    private _health: number = Constant.Game.Health;
    private _score: number = 0;
    private _kill: number = 0;
    private _serial: number = 0;

    private _playerData: PlayerData;

    private _mousedownEventListener = (event: MouseEvent) => this.draw(event);
    private _mousemoveEventListener = (event: MouseEvent) => this.aim(event);
    private _mouseupEventListener = (event: MouseEvent) => this.loose(event);

    constructor()
    {
        super();

        const svg = document.querySelector("svg");
        if (!svg)
        {
            throw new Error("Can not find svg.");
        }
        this._svg = svg;
        this._cursor = this._svg.createSVGPoint();

        this._startPosition = new Vector2();
        this._currentPosition = new Vector2();

        this._playerData = PlayerDataManager.loadCurrent()
            ?? (() => { throw new Error("Failed to load current player data.") })();
    }

    public get IsAiming(): boolean
    {
        return this._isAiming;
    }

    public get IsValidAim(): boolean
    {
        return this._isAiming && this._inRange;
    }

    public override async onInit(): Promise<void>
    {
        window.addEventListener("mousedown", this._mousedownEventListener);
        console.info(this._playerData);
    }

    public onUpdate(deltaTime: number): void
    {
    }

    public onKill(bullet: Bullet, target: Target, collision: Collision): void
    {
        const rate = 2 ** (Scene.getInstance().getGroupKill(bullet) - 1);
        var added = rate >= 1 ? JSONHelper.getByPath(Constant.Ball.Target.Score, target.Type) * rate : 0;
    
        this._score += added;
        this._kill += 1;
        // if (this._kill > 0 && this._kill % 10 == 0)
        // {
        //     Scene.getInstance().makeUpgradeEffect(Constant.Scene.Effect.Upgrade.Color);
        // }

        Scene.getInstance().setUI(this._score, this._kill);
        Scene.getInstance().setScore(added, collision.point);
        Scene.getInstance().makeHitEffect(collision.point);

    }

    public onHurt(): number
    {
        if (--this._health <= 0)
        {
            if (this._isAiming)
            {
                this.loose();
            }

            window.removeEventListener("mousedown", this._mousedownEventListener);
            window.removeEventListener("mousemove", this._mousemoveEventListener);
            window.removeEventListener("mouseup", this._mouseupEventListener);

            if (this._score > this._playerData.bestGrade.score && Date.now() > this._playerData.bestGrade.createdTime)
            {
                this._playerData.bestGrade = {
                    score: this._score,
                    kill: this._kill,
                    createdTime: Date.now()
                };
            }
            PlayerDataManager.save(this._playerData);
            Scene.getInstance().onGameOver();
        }

        return this._health;
    }
    
    private draw(event: MouseEvent): void
    {
        window.addEventListener("mousemove", this._mousemoveEventListener);
        window.addEventListener("mouseup", this._mouseupEventListener);

        const point = this._getMouseSVG(event);
        this._startPosition.copyFrom(point.x, point.y);

        this.aim(event);
    }

    private aim(event: MouseEvent): void
    {
        this._isAiming = true;

        const point = this._getMouseSVG(event);
        this._currentPosition.copyFrom(point.x, point.y);

        this._aimOffset = Vector2.subtract(this._currentPosition, this._startPosition);

        if (this._aimOffset.magnitude > Constant.Game.Bow_String.Stretch.Max)
        {
            this._aimOffset.multiply(Constant.Game.Bow_String.Stretch.Max / this._aimOffset.magnitude);
        }

        const constraintAngle = Constant.Game.Bow_String.Aim_Constraint
            ? Math.atan2(Constant.Scene.Bow_String.Y - Constant.Scene.Mask.Y, Constant.Scene.Background.Width / 2)
            : 0;

        if (this._aimOffset.angle > constraintAngle
            && this._aimOffset.angle < Math.PI - constraintAngle
            && this._aimOffset.magnitude > Constant.Game.Bow_String.Stretch.Min)
        {
            this._inRange = true;
            Scene.getInstance().setBowString(true, this._aimOffset.angle, this._aimOffset.magnitude);
            Scene.getInstance().setAimLine(true, this._aimOffset.angle, this._aimOffset.magnitude);
        }
        else
        {
            this._inRange = false;
            Scene.getInstance().setBowString(false, this._aimOffset.angle);
            Scene.getInstance().setAimLine(false);
        }
    }

    private loose(event?: MouseEvent): void
    {
        window.removeEventListener("mousemove", this._mousemoveEventListener);
        window.removeEventListener("mouseup", this._mouseupEventListener);

        if (this.IsValidAim)
        {
            this._serial++;
            Utility.getSpreadAngles(this._aimOffset.angle, Utility.degToRad(Constant.Ball.Bullet.Spread_Degree), Constant.Ball.Bullet.Spread_Count)
                .forEach(aimAngle =>
                {
                    Scene.getInstance().spawnBullet(this._serial, new Vector2(Constant.Scene.Background.Width / 2, Constant.Scene.Bow_String.Y).add(this._aimOffset), aimAngle + Math.PI);
                });
        }

        this._isAiming = false;
        Scene.getInstance().setBowString(false, this._aimOffset.angle);
        Scene.getInstance().setAimLine(false);
    }

    private _getMouseSVG(event: MouseEvent): DOMPoint
    {
        this._cursor.x = event.x;
        this._cursor.y = event.y;

        return this._cursor.matrixTransform(this._svg.getScreenCTM()?.inverse());
    }
}