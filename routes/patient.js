const express = require("express")
const router = express.Router()
const Patient = require("../Classes/Patient");

const patient = new Patient()

router.post("/create", async (req, res) => {
  try {
    const { Nom, Prenom, Naissance } = req.body;
    const status = await patient.create(Nom, Prenom, Naissance)
    res.status(201).json({ message: "Patient créé !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur création patient", ok: false, error: err.message })
  }
});

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await patient.delete(ID)
    res.status(200).json({ message: "Supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { ID, Nom, Prenom, Naissance } = req.body;
    const status = await patient.edit(ID, Nom, Prenom, Naissance)
    res.status(200).json({ message: "Patient modifié !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur modification", ok: false, error: err.message })
  }
});

router.get("/get/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const data = await patient.get(ID)
    res.status(200).json({ message: "Patient trouvé", ok: data !== null, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await patient.getAll();
    res.status(200).json({ message: "Liste des patients", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur liste", ok: false, error: err.message })
  }
});

module.exports = router;