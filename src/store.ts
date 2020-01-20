import Dexie from "dexie"

export interface InputEntity {
    id?: number
    date: Date
    from: string
    to: string
    cost: number
    memo: string
    dirIcon: string
}

class DB extends Dexie {
    inputs: Dexie.Table<InputEntity, number>;
    constructor() {
        super("DB")
        this.version(1).stores({
            inputs: "++id, date, from, to, cost, memo, dirIcon"
        });

        this.inputs = this.table("inputs")
    }
}
const db = new DB();
// var date = new Date();
// db.inputs.bulkAdd([
//     {
//         date: date,
//         from: "鹿児島",
//         to: "東京",
//         cost: 1000,
//         memo: "ほげほげaaaaa",
//         dirIcon: "arrows-alt-h"
//     },
//     {
//         date: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
//         from: "鹿児dd島",
//         to: "東京",
//         cost: 10200,
//         memo: "ほげほげdssssssssssssssssssss",
//         dirIcon: "long-arrow-alt-right"
//     }
// ])

export default db;