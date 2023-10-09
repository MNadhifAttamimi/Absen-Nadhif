const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const moment = require('moment'); // Menggunakan library moment.js untuk mengelola tanggal

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Simpan data absensi di dalam memori
const absensiData = [];

// Objek untuk melacak absensi berdasarkan ID dan tanggal
const absensiTracker = {};

// Middleware untuk validasi ID
function validateID(req, res, next) {
    const { id } = req.body;
    if (id && id.length === 5) {
        next();
    } else {
        res.status(400).json({ error: 'ID harus terdiri dari 5 karakter.' });
    }
}

// Middleware untuk mencatat waktu input
function recordTimestamp(req, res, next) {
    req.timestamp = new Date();
    next();
}

// Middleware untuk memeriksa apakah ID sudah absen pada hari ini
function checkDuplicateAbsensi(req, res, next) {
    const { id } = req.body;
    const today = moment().format('YYYY-MM-DD'); // Format tanggal saat ini

    if (absensiTracker[id] === today) {
        res.status(400).json({ error: 'ID ini sudah melakukan absensi hari ini.' });
    } else {
        absensiTracker[id] = today; // Catat tanggal absensi
        next();
    }
}

// Endpoint untuk melakukan absensi
app.post('/absensi', validateID, recordTimestamp, checkDuplicateAbsensi, (req, res) => {
    const { id } = req.body;
    const timestamp = req.timestamp;
    absensiData.push({ id, timestamp });
    res.json({ success: true, message: 'Absensi berhasil direkam.' });
});

// Endpoint untuk melihat data absensi
app.get('/absensi', (req, res) => {
    res.json(absensiData);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
