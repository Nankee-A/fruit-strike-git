export abstract class GameModule
{
    public static getInstance<T>(this: new () => T): T
    {
        (<any>this).instance ??= new this();
        return (<any>this).instance;
    }

    public async onInit(): Promise<void>
    {
    }
    
    public abstract onUpdate(deltaTime: number): void
}