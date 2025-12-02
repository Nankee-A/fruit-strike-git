import Constant from "../../constant.json" with { type: "json" };
import { Animator } from "./animator.js";
import { Ball } from "./ball.js";
import { GameModule } from "./gameModule.js";
import { JSONHelper } from "./jsonHelper.js";
import { Utility } from "./utility.js";
import { Vector2 } from "./vector2.js";
const BaseClasses = {
    Ball,
    GameModule,
    Vector2,
};
export class Base {
    static get Constant() {
        return Constant;
    }
    static get Animator() {
        return Animator;
    }
    static get Ball() {
        return Ball;
    }
    static get GameModule() {
        return GameModule;
    }
    static get JSONHelper() {
        return JSONHelper;
    }
    static get Utility() {
        return Utility;
    }
    static get Vector2() {
        return Vector2;
    }
}
