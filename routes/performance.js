const express = require("express")
const router = express.Router()
const Performance = require("../Classes/Performance");

const performance = new Performance()

router.post("/create", async (req, res) => {
  try {
    const {
      ID_Seance,
      DateCalcul,
      Vitesse_Contraction_Moyen,
      Vitesse_Relaxation_Moyen,
      Taux_Symetrie } = req.body;

    const status = await performance.create(
      ID_Seance,
      DateCalcul,
      Vitesse_Contraction_Moyen,
      Vitesse_Relaxation_Moyen,
      Taux_Symetrie)

    res.status(201).json({ message: "Performance créée !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur création performance", ok: false, error: err.message })
  }
})

router.get("/rapport/:ID_Seance{/:date}", async (req, res) => {
  try {
    const { ID_Seance, date } = req.params;
    const data = await performance.rapport(ID_Seance, date || null)
    res.status(200).json({ message: "Rapport", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur rapport", ok: false, error: err.message })
  }
})

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await performance.delete(ID)
    res.status(200).json({ message: "Supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
})

router.get("/getBySeance/:ID_Seance", async (req, res) => {
  try {
    const { ID_Seance } = req.params;
    const data = await performance.getBySeance(ID_Seance)
    res.status(200).json({ message: "Performances de la séance", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
})

module.exports = router;