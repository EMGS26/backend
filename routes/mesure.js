const express = require("express")
const router = express.Router()
const Mesure = require("../Classes/Mesure");

const mesure = new Mesure()

router.post("/create", async (req, res) => {
  try {
    const {
      ID_Seance,
      ID_Mouvement,
      Cote,
      MesureVolt,
      Temps_Contraction_ms,
      Temps_Relaxation_ms,
      Latence_ms,
      AmplitudeSignal,
      DateMesure } = req.body;

    const status = await mesure.create(
      ID_Seance,
      ID_Mouvement,
      Cote,
      MesureVolt,
      Temps_Contraction_ms,
      Temps_Relaxation_ms,
      Latence_ms,
      AmplitudeSignal,
      DateMesure)

    res.status(201).json({ message: "Mesure créée !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur création mesure", ok: false, error: err.message })
  }
});

router.get("/rapport/:ID_Seance{/:date}", async (req, res) => {
  try {
    const { ID_Seance, date } = req.params;
    const data = await mesure.rapport(ID_Seance, date || null)
    res.status(200).json({ message: "Rapport", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur rapport", ok: false, error: err.message })
  }
})

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await mesure.delete(ID)
    res.status(200).json({ message: "Supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
})

router.get("/getBySeance/:ID_Seance", async (req, res) => {
  try {
    const { ID_Seance } = req.params;
    const data = await mesure.getBySeance(ID_Seance)
    res.status(200).json({ message: "Mesures de la séance", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
})

module.exports = router;