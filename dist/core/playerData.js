export class PlayerData {
    _id;
    _password;
    _bestGrade;
    constructor(id, password) {
        this._id = id;
        this._password = password;
        this._bestGrade =
            {
                score: 0,
                kill: 0,
                createdTime: Date.now()
            };
    }
    get Id() {
        return this._id;
    }
    get Password() {
        return this._password;
    }
    get BestGrade() {
        return this._bestGrade;
    }
    updateGrade(score, kill, createdTime) {
        if (score > this._bestGrade.score && createdTime > this._bestGrade.createdTime) {
            this._bestGrade =
                {
                    score: score,
                    kill: kill,
                    createdTime: createdTime
                };
            return true;
        }
        return false;
    }
    static toObject(data) {
        const playerData = new PlayerData(data._id, data._password);
        playerData._bestGrade =
            {
                score: data._bestGrade.score,
                kill: data._bestGrade.kill,
                createdTime: data._bestGrade.createdTime
            };
        return playerData;
    }
}
