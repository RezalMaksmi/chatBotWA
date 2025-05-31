const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzretqoduCJZyKcNqCQsDKAIoBFmxCAZTmKvAPcCcwYeGuMWin_MR7YXd-wYQK64YvO/exec";

app.post('/webhook', async (req, res) => {
    const message = req.body.message || "";
    const phone = req.body.number || "";

    console.log("📩 Data masuk:", req.body); // Tambahkan ini

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

        // Kirim balasan ke Flow Builder
        return res.send({ reply: replyMessage });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ reply: "❌ Gagal menyimpan data." });
    }
});

app.listen(3000, () => console.log("Server jalan di port 3000"));
