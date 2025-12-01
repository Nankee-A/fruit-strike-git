import { Base } from "./base/base.js";
import { Player } from "./player.js";
import { Scene } from "./scene.js";
const gameModules = [
    Player.getInstance(),
    Scene.getInstance()
];
var lastUpdateTime = 0;
window.addEventListener("DOMContentLoaded", onInit);
function onInit() {
    gameModules.forEach(gameModule => {
        gameModule.onInit();
    });
    requestUpdate();
}
function requestUpdate() {
    const currentUpdateTime = Date.now();
    if (lastUpdateTime == 0) {
        lastUpdateTime = currentUpdateTime;
    }
    const deltaTime = (currentUpdateTime - lastUpdateTime) / 1000 * Base.Constant.Game.Time_Scale;
    lastUpdateTime = currentUpdateTime;
    onUpdate(deltaTime);
    requestAnimationFrame(requestUpdate);
}
function onUpdate(deltaTime) {
    gameModules.forEach(gameModule => {
        gameModule.onUpdate(deltaTime);
    });
}
