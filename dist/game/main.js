import { PlayerDataManager } from "../core/playerDataManager.js";
import { Constant } from "./base/index.js";
import { Player } from "./player.js";
import { Scene } from "./scene.js";
PlayerDataManager._currentId = "nankee";
const gameModules = [
    Player.getInstance(),
    Scene.getInstance()
];
var lastUpdateTime = 0;
window.addEventListener("DOMContentLoaded", onInit);
async function onInit() {
    await Promise.all(gameModules.map(gameModule => gameModule.onInit()));
    requestUpdate();
}
function requestUpdate() {
    const currentUpdateTime = Date.now();
    if (lastUpdateTime == 0) {
        lastUpdateTime = currentUpdateTime;
    }
    const deltaTime = (currentUpdateTime - lastUpdateTime) / 1000 * Constant.Game.Time_Scale;
    lastUpdateTime = currentUpdateTime;
    onUpdate(deltaTime);
    requestAnimationFrame(requestUpdate);
}
function onUpdate(deltaTime) {
    gameModules.forEach(gameModule => {
        gameModule.onUpdate(deltaTime);
    });
}
