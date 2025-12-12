export class JSONHelper {
    constructor() {
    }
    static getByPath(jsonObj, path) {
        const pathArray = path.split(".");
        return pathArray.reduce((current, key) => current?.[key], jsonObj);
    }
    static getRange(jsonObj) {
        const base = jsonObj?.["Base"];
        const offset = jsonObj?.["Offset"];
        if (typeof base != "number" || isNaN(base)) {
            throw new Error("Base is invalid.");
        }
        if (typeof offset != "number" || isNaN(offset)) {
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
    static getRangeByPath(jsonObj, path) {
        const rangeObj = this.getByPath(jsonObj, path);
        return this.getRange(rangeObj);
    }
    static getRandomInRange(jsonObj) {
        const range = this.getRange(jsonObj);
        return range.base + Math.random() * range.offset;
    }
    static getRandomInRangeByPath(jsonObj, path) {
        const range = this.getRangeByPath(jsonObj, path);
        return range.base + Math.random() * range.offset;
    }
}
