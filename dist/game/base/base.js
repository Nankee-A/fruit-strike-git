import Constant from "../../../constant.json" with { type: "json" };
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
export const Base = {
    Constant,
    Animator,
    Ball,
    GameModule,
    JSONHelper,
    Utility,
    Vector2,
};
