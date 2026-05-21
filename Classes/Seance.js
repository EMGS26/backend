const db = require("../Database/config/db")

class Seance {
    create(ID_Patient, ID_Exercice, Nom, DateSeance) {
        return db.insert("Seances", [
            ["ID_Patient", ID_Patient],
            ["ID_Exercice", ID_Exercice],
            ["Nom", Nom],
            ["DateSeance", DateSeance]
        ])
    }

    delete(ID) {
        return db.delete("Seances", [["ID", ID]])
    }

    edit(ID, ID_Patient, ID_Exercice, Nom, DateSeance) {
        return db.update("Seances",
            [["ID_Patient", ID_Patient], ["ID_Exercice", ID_Exercice], ["Nom", Nom], ["DateSeance", DateSeance]],
            [["ID", ID]]
        )
    }

    get(ID) {
        return db.select("Seances", ["*"], [["ID", ID]])
            .then(rows => rows[0] ?? null)
    }

    getAll() {
        return db.select("Seances", ["*"])
    }

    getByPatient(ID_Patient) {
        return db.select("Seances", ["*"], [["ID_Patient", ID_Patient]])
    }
}

module.exports = Seance