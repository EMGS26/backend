const db = require("../Database/config/db")

const CONTRACTIONS_VALIDES = ["Excentrique", "Isometrique", "Concentrique"]

class Mouvements {
    create(ID_Exercice, Nom, Ordre, Description, Serie, Repetition, Contraction, PreviewURL) {
        if (!CONTRACTIONS_VALIDES.includes(Contraction))
            throw new Error("Option invalide !")

        const attributs = [
            ["ID_Exercice", ID_Exercice],
            ["Nom", Nom],
            ["Ordre", Ordre],
            ["Description", Description],
            ["Serie", Serie],
            ["Repetition", Repetition],
            ["Contraction", Contraction]
        ]
        if (PreviewURL) attributs.push(["PreviewURL", PreviewURL])

        return db.insert("Mouvements", attributs)
    }

    delete(ID) {
        return db.delete("Mouvements", [["ID", ID]])
    }

    edit(ID, ID_Exercice, Nom, Ordre, Description, Serie, Repetition, Contraction, PreviewURL) {
        if (!CONTRACTIONS_VALIDES.includes(Contraction))
            throw new Error("Option invalide !")

        const attributs = [
            ["ID_Exercice", ID_Exercice],
            ["Nom", Nom],
            ["Ordre", Ordre],
            ["Description", Description],
            ["Serie", Serie],
            ["Repetition", Repetition],
            ["Contraction", Contraction]
        ]
        if (PreviewURL) attributs.push(["PreviewURL", PreviewURL])

        return db.update("Mouvements", attributs, [["ID", ID]])
    }

    get(ID) {
        return db.select("Mouvements", ["*"], [["ID", ID]])
            .then(rows => rows[0] ?? null)
    }

    getAll() {
        return db.select("Mouvements", ["*"])
    }

    getByExercice(ID_Exercice) {
        return db.select("Mouvements", ["*"], [["ID_Exercice", ID_Exercice]])
    }
}

module.exports = Mouvements