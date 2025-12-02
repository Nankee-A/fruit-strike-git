import Constant from "../../constant.json" with { type: "json"}
import { Animator } from "./animator.js";
import { Ball } from "./ball.js";
import { GameModule } from "./gameModule.js";
import { JSONHelper } from "./jsonHelper.js";
import { Utility } from "./utility.js";
import { Vector2 } from "./vector2.js";

export type BaseType<T extends keyof typeof BaseClasses> = InstanceType<typeof BaseClasses[T]>;

const BaseClasses =
{
    Ball,
    GameModule,
    Vector2,
}

export class Base
{
    public static get Constant()
    {
        return Constant;
    }

    public static get Animator()
    {
        return Animator
    }

    public static get Ball()
    {
        return Ball;
    }

    public static get GameModule()
    {
        return GameModule;
    }

    public static get JSONHelper()
    {
        return JSONHelper;
    }

    public static get Utility()
    {
        return Utility;
    }

    public static get Vector2()
    {
        return Vector2;
    }
}