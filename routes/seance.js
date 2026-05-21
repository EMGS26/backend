const express = require("express")
const router = express.Router()
const Seance = require("../Classes/Seance");

const seance = new Seance()

router.post("/create", async (req, res) => {
  try {
    const { ID_Patient, ID_Exercice, Nom, DateSeance } = req.body;
    const status = await seance.create(ID_Patient, ID_Exercice, Nom, DateSeance)
    res.status(201).json({ message: "Séance créée", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur création séance", ok: false, error: err.message })
  }
})

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await seance.delete(ID)
    res.status(200).json({ message: "Supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { ID, ID_Patient, ID_Exercice, Nom, DateSeance } = req.body;
    const status = await seance.edit(ID, ID_Patient, ID_Exercice, Nom, DateSeance)
    res.status(200).json({ message: "Séance modifiée !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur modification", ok: false, error: err.message })
  }
});

router.get("/get/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const data = await seance.get(ID)
    res.status(200).json({ message: "Séance trouvée", ok: data !== null, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await seance.getAll();
    res.status(200).json({ message: "Liste des séances", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur liste", ok: false, error: err.message })
  }
});

router.get("/getByPatient/:ID_Patient", async (req, res) => {
  try {
    const { ID_Patient } = req.params;
    const data = await seance.getByPatient(ID_Patient)
    res.status(200).json({ message: "Séances du patient", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche par patient", ok: false, error: err.message })
  }
});

module.exports = router;
