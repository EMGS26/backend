const db = require("../Database/config/db")

class Mesure {
    create(ID_Seance, ID_Mouvement, Cote, MesureVolt, Temps_Contraction_ms, Temps_Relaxation_ms, Latence_ms, AmplitudeSignal, DateMesure) {
        return db.insert("Mesures", [
            ["ID_Seance", ID_Seance],
            ["ID_Mouvement", ID_Mouvement],
            ["Cote", Cote],
            ["MesureVolt", MesureVolt],
            ["Temps_Contraction_ms", Temps_Contraction_ms],
            ["Temps_Relaxation_ms", Temps_Relaxation_ms],
            ["Latence_ms", Latence_ms],
            ["AmplitudeSignal", AmplitudeSignal],
            ["DateMesure", DateMesure]
        ])
    }

    rapport(ID_Seance, date = null) {
        const conditions = [["ID_Seance", ID_Seance]]
        if (date) conditions.push(["DateMesure", date])
        return db.select("Mesures", ["*"], conditions)
    }

    delete(ID) {
        return db.delete("Mesures", [["ID", ID]])
    }

    getBySeance(ID_Seance) {
        return db.select("Mesures", ["*"], [["ID_Seance", ID_Seance]])
    }
}

module.exports = Mesure