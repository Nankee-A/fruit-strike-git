export type PlayerData =
    {
        id: string,
        password: string,
        bestGrade:
        {
            score: number,
            kill: number,
            createdTime: number
        },
        rank: number
    };

export class PlayerDataManager 
{
    private static readonly PREFIX = "player_";
    public static _currentId: string;

    public static load(id: string): PlayerData | undefined 
    {
        const data = localStorage.getItem(this.PREFIX + id);
        return data ? (JSON.parse(data) as PlayerData) : undefined;
    }

    public static loadCurrent(): PlayerData | undefined
    {
        return this.load(this._currentId);
    }

    public static loadAll(): PlayerData[]
    {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => this.load(key.substring(this.PREFIX.length))!);
    }

    public static register(id: string, password: string): PlayerData
    {
        if (this.load(id))
        {
            throw new Error(`Player data ${id} already exists.`);
        }

        const playerData: PlayerData =
        {
            id: id,
            password: password,
            bestGrade:
            {
                score: Number.MIN_VALUE,
                kill: Number.MIN_VALUE,
                createdTime: Number.MIN_VALUE
            },
            rank: Number.MAX_VALUE
        };

        this.save(playerData, false);

        return playerData;
    }

    public static save(playerData: PlayerData, refresh: boolean = true): void
    {
        const key = this.PREFIX + playerData.id;
        localStorage.setItem(key, JSON.stringify(playerData));

        if (refresh)
        {
            this.loadAll()
                .sort((a, b) =>
                {
                    var comparison = b.bestGrade.score - a.bestGrade.score;
                    if (comparison == 0)
                    {
                        comparison = a.bestGrade.createdTime - b.bestGrade.createdTime;
                    }
                    return comparison;
                })
                .forEach((data, index) =>
                {
                    data.rank = index + 1;
                    this.save(data, false);
                });
        }
    }
}