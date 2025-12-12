export class Utility
{
    private constructor()
    {
    }

    public static radToDeg(angle: number): number
    {
        return angle / Math.PI * 180;
    }

    public static degToRad(angle: number): number
    {
        return angle / 180 * Math.PI;
    }

    public static getSpreadAngles(direction: number, spread: number, count: number): number[]
    {
        if (count <= 0)
        {
            return [];
        }

        if (count == 1)
        {
            return [direction];
        }

        const totalSpread = spread * (count - 1);
        const startAngle = direction - totalSpread / 2;

        const angles: number[] = [];
        for (let i = 0; i < count; i++)
        {
            angles.push(startAngle + spread * i);
        }

        return angles;
    }
}