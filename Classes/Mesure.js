const db = require("../Database/config/db")

// File-level queue to store measures to be inserted
const insertQueue = [];
let processing = false;

async function processQueue() {
    if (processing || insertQueue.length === 0) return;
    processing = true;

    while (insertQueue.length > 0) {
        const item = insertQueue.shift();
        try {
            await db.insert("Mesures", [
                ["ID_Seance", item.ID_Seance],
                ["ID_Mouvement", item.ID_Mouvement],
                ["Cote", item.Cote],
                ["MesureVolt", item.MesureVolt],
                ["Temps_Contraction_ms", item.Temps_Contraction_ms],
                ["Temps_Relaxation_ms", item.Temps_Relaxation_ms],
                ["Latence_ms", item.Latence_ms],
                ["AmplitudeSignal", item.AmplitudeSignal],
                ["DateMesure", item.DateMesure]
            ]);
        } catch (err) {
            console.error("[Mesure Queue] Erreur insertion base de données :", err.message);
        }
        // Attendre 10ms entre chaque insertion pour étaler la charge sur la base de données
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    processing = false;
}

// Vérifier et traiter la queue toutes les 250ms
setInterval(processQueue, 250);

class Mesure {
    create(ID_Seance, ID_Mouvement, Cote, MesureVolt, Temps_Contraction_ms, Temps_Relaxation_ms, Latence_ms, AmplitudeSignal, DateMesure) {
        insertQueue.push({
            ID_Seance,
            ID_Mouvement,
            Cote,
            MesureVolt,
            Temps_Contraction_ms,
            Temps_Relaxation_ms,
            Latence_ms,
            AmplitudeSignal,
            DateMesure
        });
        
        // On retourne immédiatement un succès pour libérer la route Express et éliminer tout lag
        return Promise.resolve(true);
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