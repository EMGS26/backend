const db = require("../Database/config/db")

class Performance {
    create(ID_Seance, DateCalcul, Vitesse_Contraction_Moyen, Vitesse_Relaxation_Moyen, Taux_Symetrie) {
        return db.insert("Performances", [
            ["ID_Seance", ID_Seance],
            ["DateCalcul", DateCalcul],
            ["Vitesse_Contraction_Moyen", Vitesse_Contraction_Moyen],
            ["Vitesse_Relaxation_Moyen", Vitesse_Relaxation_Moyen],
            ["Taux_Symetrie", Taux_Symetrie]
        ])
    }

    rapport(ID_Seance, date = null) {
        const conditions = [["ID_Seance", ID_Seance]]
        if (date) conditions.push(["DateCalcul", date])
        return db.select("Performances", ["*"], conditions)
    }

    delete(ID) {
        return db.delete("Performances", [["ID", ID]])
    }

    getBySeance(ID_Seance) {
        return db.select("Performances", ["*"], [["ID_Seance", ID_Seance]])
    }

    getAll() {
        return db.select("Performances", ["*"])
    }
}

module.exports = Performance