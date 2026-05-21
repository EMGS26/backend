const db = require("../Database/config/db")

class Patient {
    create(Nom, Prenom, Naissance) {
        return db.insert("Patients", [
            ["Nom", Nom],
            ["Prenom", Prenom],
            ["Naissance", Naissance]
        ])
    }

    delete(ID) {
        return db.delete("Patients", [["ID", ID]])
    }

    edit(ID, Nom, Prenom, Naissance) {
        return db.update("Patients",
            [["Nom", Nom], ["Prenom", Prenom], ["Naissance", Naissance]],
            [["ID", ID]]
        )
    }

    get(ID) {
        return db.select("Patients", ["*"], [["ID", ID]])
            .then(rows => rows[0] ?? null)
    }

    getAll() {
        return db.select("Patients", ["*"])
    }
}

module.exports = Patient