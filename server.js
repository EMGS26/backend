const express = require("express");
const app = express()

// CORS – autorise le frontend à appeler l'API (DOIT être le tout premier middleware)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API Kinésithérapie en ligne')
})

const patient = require("./routes/patient")
app.use("/patient", patient)

const exercice = require("./routes/exercice")
app.use("/exercice", exercice)

const mouvement = require("./routes/mouvement")
app.use("/mouvement", mouvement)

const seance = require("./routes/seance")
app.use("/seance", seance)

const mesure = require("./routes/mesure")
app.use("/mesure", mesure)

const performance = require("./routes/performance")
app.use("/performance", performance)

// Gestionnaire d'erreurs global – renvoie toujours les en-têtes CORS
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  console.error("Erreur serveur :", err.message);
  res.status(500).json({ message: "Erreur serveur interne", ok: false, error: err.message });
});

app.listen(3000, () => {
  console.log('Serveur est en ligne sur http://localhost:3000')
})