import { Base } from "./base/base.js";
export class Bullet extends Base.Ball {
    constructor(radius, mass, position, velocity, acceleration, handleCollisionCallback) {
        super(radius, mass, position, velocity, acceleration, handleCollisionCallback);
    }
    get InScene() {
        return this._position.x >= 0 - this._radius
            && this._position.x <= Base.Constant.Scene.Background.Width + this._radius
            && this._position.y >= 0 - this._radius
            && this._position.y <= Base.Constant.Scene.Background.Height + this._radius;
    }
    get IsValid() {
        return this.InScene && this._position.y <= Base.Constant.Scene.Mask.Y - this._radius;
    }
    static create(position, angle, handleCollisionCallback = undefined) {
        const radius = Base.Constant.Ball.Radius.Bullet;
        const mass = Base.Constant.Ball.Mass.Bullet;
        const velocity = new Base.Vector2(Math.cos(angle), Math.sin(angle)).multiply(Base.Constant.Ball.Bullet.Speed.Base);
        const acceleration = new Base.Vector2();
        return new Bullet(radius, mass, position, velocity, acceleration, handleCollisionCallback);
    }
    handleCollisions(deltaTime) {
        //Nothing TODO
    }
}
