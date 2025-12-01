export abstract class GameModule
{
    public static getInstance<T>(this: new () => T): T
    {
        (<any>this).instance ??= new this();
        return (<any>this).instance;
    }

    public abstract onInit(): void;
    public abstract onUpdate(deltaTime: number): void
}