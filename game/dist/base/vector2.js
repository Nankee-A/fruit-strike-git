export class Vector2 {
    _x;
    _y;
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get square() {
        return this._x ** 2 + this._y ** 2;
    }
    get angle() {
        return Math.atan2(this._y, this._x);
    }
    get magnitude() {
        return Math.sqrt(this.square);
    }
    get normalize() {
        const nx = this.magnitude == 0 ? 0 : this._x / this.magnitude;
        const ny = this.magnitude == 0 ? 0 : this._y / this.magnitude;
        return new Vector2(nx, ny);
    }
    add(other) {
        this._x += other._x;
        this._y += other._y;
        return this;
    }
    subtract(other) {
        this._x -= other._x;
        this._y -= other._y;
        return this;
    }
    multiply(scalar) {
        this._x *= scalar;
        this._y *= scalar;
        return this;
    }
    flipX() {
        this._x = -this._x;
        return this;
    }
    flipY() {
        this._y = -this._y;
        return this;
    }
    rotate(axis, angle) {
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
    dot(other) {
        return this._x * other._x + this._y * other._y;
    }
    cross(other) {
        return this._x * other._y - other._x * this._y;
    }
    copyFrom(arg1, arg2) {
        if (arg1 instanceof Vector2) {
            this._x = arg1._x;
            this._y = arg1._y;
        }
        else {
            this._x = arg1;
            this._y = arg2;
        }
        return this;
    }
    clone(other) {
        return new Vector2(this._x, this._y);
    }
    static add(v1, v2) {
        return new Vector2(v1._x + v2._x, v1._y + v2._y);
    }
    static subtract(v1, v2) {
        return new Vector2(v1._x - v2._x, v1._y - v2.y);
    }
    static multiply(v, scalar) {
        return new Vector2(v._x * scalar, v._y * scalar);
    }
    static rotate(vector, axis, angle) {
        const x = vector._x - axis._x;
        const y = vector._y - axis._y;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;
        return new Vector2(axis._x + rotatedX, axis._y + rotatedY);
    }
    static dot(v1, v2) {
        return v1._x * v2._x + v1._y * v2._y;
    }
    static cross(v1, v2) {
        return v1._x * v2._y - v2._x * v1._y;
    }
    distanceTo(other) {
        const dx = other._x - this._x;
        const dy = other._y - this._y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }
    distanceToSegment(p1, p2) {
        const v1 = new Vector2(this._x - p1._x, this._y - p1._y);
        const v2 = new Vector2(p2._x - p1._x, p2._y - p1._y);
        if (v2.square === 0) {
            return this.distanceTo(p1);
        }
        const param = Vector2.dot(v1, v2) / v2.square;
        var p3;
        if (param < 0) {
            p3 = p1;
        }
        else if (param > 1) {
            p3 = p2;
        }
        else {
            p3 = new Vector2(p1._x + param * (p2._x - p1._x), p1._y + param * (p2._y - p1._y));
        }
        return this.distanceTo(p3);
    }
    static segmentDistance(p1, p2, p3, p4) {
        if (this._doSegmentIntersect(p1, p2, p3, p4)) {
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
    static _doSegmentIntersect(p1, p2, p3, p4) {
        const c1 = Vector2.subtract(p4, p3).cross(Vector2.subtract(p1, p3));
        const c2 = Vector2.subtract(p4, p3).cross(Vector2.subtract(p2, p3));
        const c3 = Vector2.subtract(p2, p1).cross(Vector2.subtract(p3, p1));
        const c4 = Vector2.subtract(p2, p1).cross(Vector2.subtract(p4, p1));
        return (c1 * c2 <= 0) && (c3 * c4 <= 0);
    }
}
