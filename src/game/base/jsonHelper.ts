export class JSONHelper
{
    private constructor()
    {
    }

    public static getByPath(jsonObj: any, path: string): any
    {
        const pathArray = path.split(".");
        return pathArray.reduce((current, key) => current?.[key], jsonObj);
    }

    public static getRange(jsonObj: any): { base: number, offset: number, min: number, max: number }
    {
        const base: number = jsonObj?.["Base"];
        const offset: number = jsonObj?.["Offset"];

        if (typeof base != "number" || isNaN(base))
        {
            throw new Error("Base is invalid.");
        }

        if (typeof offset != "number" || isNaN(offset))
        {
            throw new Error("Offset is invalid.");
        }

        const values = [base, base + offset];
        
        return {
            base: base,
            offset: offset,
            min: Math.min(...values),
            max: Math.max(...values)
        };
    }

    public static getRangeByPath(jsonObj: any, path: string): { base: number, offset: number, min: number, max: number }
    {
        const rangeObj = this.getByPath(jsonObj, path);
        return this.getRange(rangeObj);
    }

    public static getRandomInRange(jsonObj: any): number
    {
        const range = this.getRange(jsonObj);
        return range.base + Math.random() * range.offset;
    }

    public static getRandomInRangeByPath(jsonObj: any, path: string): number
    {
        const range = this.getRangeByPath(jsonObj, path);
        return range.base + Math.random() * range.offset;
    }
}