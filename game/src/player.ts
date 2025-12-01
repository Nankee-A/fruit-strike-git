import { Base, BaseType } from "./base/base.js";
import { Vector2 } from "./base/vector2.js";
import { Scene } from "./scene.js";

export class Player extends Base.GameModule
{
    private _svg: SVGSVGElement;
    private _cursor: DOMPoint;

    private _startPosition: BaseType<"Vector2">;
    private _currentPosition: BaseType<"Vector2">;

    private _isAiming: boolean = false;
    private _inRange: boolean = false;

    private _aimOffset: BaseType<"Vector2"> = new Vector2();

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

        this._startPosition = new Base.Vector2();
        this._currentPosition = new Base.Vector2();
    }

    public get IsAiming(): boolean
    {
        return this._isAiming;
    }

    public get IsValidAim(): boolean
    {
        return this._isAiming && this._inRange;
    }

    public onInit(): void
    {
        window.addEventListener("mousedown", (event) => this.draw(event));
        //initHealth
    }

    public onUpdate(deltaTime: number): void
    {

    }

    public onMiss(): void
    {
        //console.info("shit!");
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

        this._aimOffset = Base.Vector2.subtract(this._currentPosition, this._startPosition);

        if (this._aimOffset.magnitude > Base.Constant.Game.Bow_String.Stretch.Max)
        {
            this._aimOffset.multiply(Base.Constant.Game.Bow_String.Stretch.Max / this._aimOffset.magnitude);
        }

        const constraintAngle = Base.Constant.Game.Bow_String.Aim_Constraint
            ? Math.atan2(Base.Constant.Scene.Bow_String.Y - Base.Constant.Scene.Mask.Y, Base.Constant.Scene.Background.Width / 2)
            : 0;

        if (this._aimOffset.angle > constraintAngle
            && this._aimOffset.angle < Math.PI - constraintAngle
            && this._aimOffset.magnitude > Base.Constant.Game.Bow_String.Stretch.Min)
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

    private loose(event: MouseEvent): void
    {
        window.removeEventListener("mousemove", this._mousemoveEventListener);
        window.removeEventListener("mouseup", this._mouseupEventListener);

        if (this.IsValidAim)
        {
            Base.Utility.getSpreadAngles(this._aimOffset.angle, Base.Utility.degToRad(Base.Constant.Ball.Bullet.Spread_Degree), Base.Constant.Ball.Bullet.Spread_Count)
                .forEach(aimAngle =>
                {
                    Scene.getInstance().spawnBullet(new Vector2(Base.Constant.Scene.Background.Width / 2, Base.Constant.Scene.Bow_String.Y).add(this._aimOffset), aimAngle + Math.PI);
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