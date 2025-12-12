export class Utility {
    constructor() {
    }
    static radToDeg(angle) {
        return angle / Math.PI * 180;
    }
    static degToRad(angle) {
        return angle / 180 * Math.PI;
    }
    static getSpreadAngles(direction, spread, count) {
        if (count <= 0) {
            return [];
        }
        if (count == 1) {
            return [direction];
        }
        const totalSpread = spread * (count - 1);
        const startAngle = direction - totalSpread / 2;
        const angles = [];
        for (let i = 0; i < count; i++) {
            angles.push(startAngle + spread * i);
        }
        return angles;
    }
}
