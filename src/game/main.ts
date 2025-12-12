import { Constant, GameModule } from "./base/index.js";
import { Player } from "./player.js";
import { Scene } from "./scene.js";

const gameModules: GameModule[] = [
    Player.getInstance(),
    Scene.getInstance()
];

var lastUpdateTime: number = 0;

window.addEventListener("DOMContentLoaded", onInit);

async function onInit()
{
    await Promise.all(gameModules.map(gameModule => gameModule.onInit()))
    requestUpdate();
}

function requestUpdate()
{
    const currentUpdateTime = Date.now();
    if (lastUpdateTime == 0)
    {
        lastUpdateTime = currentUpdateTime;
    }

    const deltaTime = (currentUpdateTime - lastUpdateTime) / 1000 * Constant.Game.Time_Scale;
    lastUpdateTime = currentUpdateTime; 

    onUpdate(deltaTime);
    requestAnimationFrame(requestUpdate);
}

function onUpdate(deltaTime: number)
{
    gameModules.forEach(gameModule =>
    {
        gameModule.onUpdate(deltaTime);
    });
}