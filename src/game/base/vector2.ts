/**
 * @internal
 */
export class Vector2
{
    private _x: number;
    private _y: number;

    public constructor(x: number = 0, y: number = 0)
    {
        this._x = x;
        this._y = y;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get square(): number
    {
        return this._x ** 2 + this._y ** 2;
    }

    public get angle(): number
    {
        return Math.atan2(this._y, this._x);
    }

    public get magnitude(): number
    {
        return Math.sqrt(this.square);
    }

    public get normalize(): Vector2
    {
        const nx = this.magnitude == 0 ? 0 : this._x / this.magnitude;
        const ny = this.magnitude == 0 ? 0 : this._y / this.magnitude;
        return new Vector2(nx, ny);
    }

    public add(other:Vector2): Vector2
    {
        this._x += other._x;
        this._y += other._y;
        return this;
    }

    public subtract(other: Vector2): Vector2
    {
        this._x -= other._x;
        this._y -= other._y;
        return this;
    }

    public multiply(scalar: number): Vector2
    {
        this._x *= scalar;
        this._y *= scalar;
        return this;
    }

    public flipX(): Vector2
    {
        this._x = -this._x;
        return this;
    }

    public flipY(): Vector2
    {
        this._y = -this._y;
        return this;
    }

    public rotate(axis: Vector2, angle: number): Vector2
    {
        const x = this._x - axis._x;
        const y = this._y - axis._y;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;

        this._x = axis._x + rotatedX;
        this._y = axis._y + rotatedY;

        return this;
    }

    public dot(other: Vector2): number
    {
        return this._x * other._x + this._y * other._y;
    }

    public cross(other: Vector2): number
    {
        return this._x * other._y - other._x * this._y;
    }

    public copyFrom(other: Vector2): Vector2;
    public copyFrom(x: number, y: number): Vector2;

    public copyFrom(arg1: Vector2 | number, arg2?: number): Vector2
    {
        if (arg1 instanceof Vector2)
        {
            this._x = arg1._x;
            this._y = arg1._y;
        }
        else
        {
            this._x = arg1 as number;
            this._y = arg2 as number;
        }

        return this;
    }

    public clone(): Vector2
    {
        return new Vector2(this._x, this._y);
    }

    public static add(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1._x + v2._x, v1._y + v2._y);
    }

    public static subtract(v1: Vector2, v2: Vector2): Vector2
    {
        return new Vector2(v1._x - v2._x, v1._y - v2.y);
    }

    public static multiply(v: Vector2, scalar: number): Vector2
    {
        return new Vector2(v._x * scalar, v._y * scalar);
    }

    public static rotate(vector: Vector2, axis: Vector2, angle: number): Vector2
    {
        const x = vector._x - axis._x;
        const y = vector._y - axis._y;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;

        return new Vector2(axis._x + rotatedX, axis._y + rotatedY);
    }

    public static dot(v1: Vector2, v2: Vector2): number
    {
        return v1._x * v2._x + v1._y * v2._y;
    }

    public static cross(v1: Vector2, v2: Vector2): number
    {
        return v1._x * v2._y - v2._x * v1._y;
    }

    public distanceTo(other: Vector2): number
    {
        const dx = other._x - this._x;
        const dy = other._y - this._y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    public distanceToSegment(p1: Vector2, p2: Vector2): number
    {
        const v1 = new Vector2(this._x - p1._x, this._y - p1._y);
        const v2 = new Vector2(p2._x - p1._x, p2._y - p1._y);

        if (v2.square === 0)
        {
            return this.distanceTo(p1);
        }

        const param = Vector2.dot(v1, v2) / v2.square;
        var p3;

        if (param < 0)
        {
            p3 = p1;
        }
        else if (param > 1)
        {
            p3 = p2;
        }
        else
        {
            p3 = new Vector2(p1._x + param * (p2._x - p1._x), p1._y + param * (p2._y - p1._y));
        }

        return this.distanceTo(p3);
    }

    public distanceToLine(p1: Vector2, p2: Vector2): number
    {
        const lineLength = p1.distanceTo(p2);

        if (lineLength <= 0)
        {
            return this.distanceTo(p1);
        }

        const cross = Math.abs(Vector2.cross(Vector2.subtract(p2, p1), Vector2.subtract(this, p1)));
        return cross / lineLength;
    }

    public static segmentDistance(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): number
    {
        if (this._doSegmentIntersect(p1, p2, p3, p4))
        {
            return 0;
        }

        const distances = [
            p1.distanceToSegment(p3, p4),
            p2.distanceToSegment(p3, p4),
            p3.distanceToSegment(p1, p2),
            p4.distanceToSegment(p1, p2)
        ];

        return Math.min(...distances);
    }

    public static segmentLineDistance(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): number
    {
        if (this._doSegmentLineIntersect(p1, p2, p3, p4))
        {
            return 0;
        }

        const distances = [
            p1.distanceToLine(p3, p4),
            p2.distanceToLine(p3, p4)
        ];

        return Math.min(...distances);
    }

    private static _doSegmentIntersect(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): boolean
    {
        const c1: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p1, p3));
        const c2: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p2, p3));
        const c3: number = Vector2.subtract(p2, p1).cross(Vector2.subtract(p3, p1));
        const c4: number = Vector2.subtract(p2, p1).cross(Vector2.subtract(p4, p1));

        return (c1 * c2 <= 0) && (c3 * c4 <= 0);
    }

    private static _doSegmentLineIntersect(p1: Vector2, p2: Vector2, p3: Vector2, p4: Vector2): boolean
    {
        const c1: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p1, p3));
        const c2: number = Vector2.subtract(p4, p3).cross(Vector2.subtract(p2, p3));

        return c1 * c2 <= 0;
    }
}