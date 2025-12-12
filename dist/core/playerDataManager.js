export class PlayerDataManager {
    static PREFIX = "player_";
    static load(id) {
        const data = localStorage.getItem(this.PREFIX + id);
        return data ? JSON.parse(data) : undefined;
    }
    static loadAll() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => this.load(key.substring(this.PREFIX.length)));
    }
    static register(id, password) {
        if (this.load(id)) {
            throw new Error(`Player data ${id} already exists.`);
        }
        const playerData = {
            id: id,
            password: password,
            bestGrade: {
                score: Number.MIN_VALUE,
                kill: Number.MIN_VALUE,
                createdTime: Number.MIN_VALUE
            },
            rank: Number.MAX_VALUE
        };
        this.save(playerData, false);
        return playerData;
    }
    static save(playerData, refresh = true) {
        const key = this.PREFIX + playerData.id;
        localStorage.setItem(key, JSON.stringify(playerData));
        if (refresh) {
            this.loadAll()
                .sort((a, b) => {
                var comparison = b.bestGrade.score - a.bestGrade.score;
                if (comparison == 0) {
                    comparison = a.bestGrade.createdTime - b.bestGrade.createdTime;
                }
                return comparison;
            })
                .forEach((data, index) => {
                data.rank = index + 1;
                this.save(data, false);
            });
        }
    }
}
