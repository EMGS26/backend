const express = require("express")
const router = express.Router()
const Exercice = require("../Classes/Exercice");

const exercice = new Exercice()

router.post("/create", async (req, res) => {
  try {
    const { Nom, Description, Muscle } = req.body
    const status = await exercice.create(Nom, Description, Muscle);
    res.status(201).json({ message: "Exercice créé !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur création exercice", ok: false, error: err.message })
  }
});

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await exercice.delete(ID);
    res.status(200).json({ message: "Supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { ID, Nom, Description, Muscle } = req.body
    const status = await exercice.edit(ID, Nom, Description, Muscle);
    res.status(200).json({ message: "Exercice modifié !", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur modification", ok: false, error: err.message })
  }
});

router.get("/get/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const data = await exercice.get(ID)
    res.status(200).json({ message: "Exercice trouvé", ok: data !== null, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await exercice.getAll();
    res.status(200).json({ message: "Liste des exercices", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur liste", ok: false, error: err.message })
  }
});

module.exports = router;