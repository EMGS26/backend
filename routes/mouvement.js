const express = require("express")
const router = express.Router()
const Mouvement = require("../Classes/Mouvement");

const mouvement = new Mouvement()

router.post("/create", async (req, res) => {
  try {
    const {
      ID_Exercice,
      Nom,
      Ordre,
      Description,
      Serie,
      Repetition,
      Contraction,
      PreviewURL } = req.body;

    const status = await mouvement.create(
      ID_Exercice,
      Nom,
      Ordre,
      Description,
      Serie,
      Repetition,
      Contraction,
      PreviewURL)

    res.status(201).json({ message: "Mouvement créé !", ok: status, body: req.body });
  } catch (err) {
    res.status(500).json({ message: "Erreur création mouvement", ok: false, error: err.message })
  }
});

router.delete("/delete/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const status = await mouvement.delete(ID);
    res.status(200).json({ message: "Mouvement supprimé", ok: status })
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", ok: false, error: err.message })
  }
});

router.patch("/edit", async (req, res) => {
  try {
    const { ID, ID_Exercice, Nom, Ordre, Description,
      Serie, Repetition, Contraction, PreviewURL } = req.body

    const status = await mouvement.edit(ID, ID_Exercice, Nom, Ordre,
      Description, Serie, Repetition, Contraction, PreviewURL)

    res.status(200).json({ message: "Mouvement modifié", ok: status, body: req.body })
  } catch (err) {
    res.status(500).json({ message: "Erreur modification", ok: false, error: err.message })
  }
})

router.get("/get/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const data = await mouvement.get(ID)
    res.status(200).json({ message: "Mouvement trouvé", ok: data !== null, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche", ok: false, error: err.message })
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await mouvement.getAll()
    res.status(200).json({ message: "Liste des mouvements", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur liste", ok: false, error: err.message })
  }
});

router.get("/getByExercice/:ID_Exercice", async (req, res) => {
  try {
    const { ID_Exercice } = req.params;
    const data = await mouvement.getByExercice(ID_Exercice)
    res.status(200).json({ message: "Mouvements liés à l'exercice", ok: data.length > 0, data: data })
  } catch (err) {
    res.status(500).json({ message: "Erreur recherche par exercice", ok: false, error: err.message })
  }
});

module.exports = router;