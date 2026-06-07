const WebSocket = require("ws");
const os = require("os");
const db = require("../Database/config/db");
const http = require("http");

const PORT = 3001;

async function callMesureRoute(body) {
    if (typeof fetch !== "undefined") {
        const res = await fetch("http://127.0.0.1:3000/mesure/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return res.json();
    }

    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(body);
        const req = http.request({
            hostname: "127.0.0.1",
            port: 3000,
            path: "/mesure/create",
            method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(dataString) }
        }, (res) => {
            let body = "";
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => { try { resolve(JSON.parse(body)); } catch (e) { resolve({ ok: false }); } });
        });
        req.on("error", reject);
        req.write(dataString);
        req.end();
    });
}

const wss = new WebSocket.Server({ port: PORT }, () => {
    const ips = os.networkInterfaces();
    const locals = Object.values(ips).flat().filter(i => i.family === "IPv4" && !i.internal).map(i => i.address);
    console.log(`Serveur WebSocket démarré sur le port ${PORT}`);
    locals.forEach(ip => console.log(`  ws://${ip}:${PORT}`));
});

wss.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Client connecté: ${ip}`);

    ws.isAlive = true;
    ws.on("pong", () => { ws.isAlive = true; });

    ws.on("message", async (data, isBinary) => {
        const messageText = data.toString();
        console.log(`Message reçu de ${ip}: ${messageText}`);

        try {
            const msg = JSON.parse(messageText);
            if (msg.type === "DATA") {
                let rows = await db.select("Mouvements", ["ID"], [["Nom", msg.nom_mouvement]]);
                if (!rows?.length) rows = await db.select("Mouvements", ["ID"], [["Description", msg.nom_mouvement]]);

                const dateMesure = new Date().toISOString().slice(0, 19).replace("T", " ");

                callMesureRoute({
                    ID_Seance: msg.id_seance,
                    ID_Mouvement: rows?.[0]?.ID || null,
                    Cote: msg.cote,
                    MesureVolt: msg.tension,
                    Temps_Contraction_ms: msg.temps_contraction_ms,
                    Temps_Relaxation_ms: msg.temps_relaxation_ms,
                    Latence_ms: msg.latence_ms,
                    AmplitudeSignal: msg.amplitude,
                    DateMesure: dateMesure
                })
                    .then(res => console.log(`Mesure enregistrée:`, res))
                    .catch(err => console.error(`Erreur enregistrement:`, err.message));
            }
        } catch (e) { }

        let count = 0;
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
                count++;
            }
        });
        console.log(`Diffusion à ${count} client(s)`);
    });

    ws.on("error", (err) => console.error(`Erreur client (${ip}):`, err));
    ws.on("close", () => console.log(`Client déconnecté: ${ip}`));
});

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on("close", () => clearInterval(interval));
wss.on("error", (err) => console.error("Erreur serveur:", err));