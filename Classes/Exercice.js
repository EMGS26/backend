const db = require("../Database/config/db")

class Exercice {
    create(Nom, Description, Muscle) {
        return db.insert("Exercices", [
            ["Nom", Nom],
            ["Description", Description],
            ["Muscle", Muscle]
        ])
    }

    delete(ID) {
        return db.delete("Exercices", [["ID", ID]])
    }

    edit(ID, Nom, Description, Muscle) {
        return db.update("Exercices",
            [["Nom", Nom], ["Description", Description], ["Muscle", Muscle]],
            [["ID", ID]]
        )
    }

    get(ID) {
        return db.select("Exercices", ["*"], [["ID", ID]])
            .then(rows => rows[0] ?? null)
    }

    getAll() {
        return db.select("Exercices", ["*"])
    }
}

module.exports = Exercice