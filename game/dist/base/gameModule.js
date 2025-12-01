export class GameModule {
    static getInstance() {
        this.instance ??= new this();
        return this.instance;
    }
}
