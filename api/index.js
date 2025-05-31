const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');

const app = express();
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz...";

app.post('/webhook', async (req, res) => {
    const message = req.body.message || "";
    const phone = req.body.number || "";

    const parts = message.split("|");
    if (parts.length !== 3) {
        return res.send({ reply: "❌ Format salah. Gunakan: pemasukan|keterangan|jumlah" });
    }

    const [tipe, keterangan, jumlah] = parts;
    const replyMessage = `✅ ${tipe} berhasil dicatat:\n${keterangan} - Rp${jumlah}`;

    try {
        await axios.post(GOOGLE_SCRIPT_URL, {
            tipe: tipe.toLowerCase(),
            keterangan,
            jumlah
        });

        res.send({ reply: replyMessage });
    } catch (err) {
        console.error(err);
        res.status(500).send({ reply: "❌ Gagal menyimpan data." });
    }
});

module.exports = app;
module.exports.handler = serverless(app); // ⬅️ ini penting!
