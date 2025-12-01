export class Utility {
    constructor() {
    }
    static radToDeg(angle) {
        return angle / Math.PI * 180;
    }
    static degToRad(angle) {
        return angle / 180 * Math.PI;
    }
    // public static normalizeDeg(angle: number): number
    // {
    //     var normalized = angle % 360;
    //     if (normalized > 180)
    //     {
    //         normalized -= 360;
    //     }
    //     if (normalized <= -180)
    //     {
    //         normalized += 360;
    //     }
    //     return normalized;
    // }
    // public static normalizeRad(angle: number): number
    // {
    //     var normalized = angle % (2 * Math.PI);
    //     if (normalized > Math.PI)
    //     {
    //         normalized -= 2 * Math.PI;
    //     }
    //     if (normalized <= Math.PI)
    //     {
    //         normalized += 2 * Math.PI;
    //     }
    //     return normalized;
    // }
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
