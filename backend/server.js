const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

// Fetch all recall data with JOINs for meaningful output
app.get('/api/recalls', async (req, res) => {
  try {
    const query = `
      SELECT
        r.rueckruf_id,
        r.year,
        r.month,
        r.day,
        r.prue_number,
        r.kassasperre,
        l.lieferantenname AS supplier_name,
        p.product_bezeichnung AS product_name,
        p.specific_articlenumber AS recall_number,
        r.artikelanzahl_prue AS amortisation_period,
        CASE WHEN r.meldung THEN 'Yes' ELSE 'No' END AS re_delivery_possible
      FROM rueckruf r
             LEFT JOIN lieferant l ON r.lieferant_id = l.liefranten_id
             LEFT JOIN product p ON r.product_id = p.product_id;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Fetch single recall data by ID with JOINs for detailed view
app.get('/api/recalls/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const query = `
      SELECT
        r.*,
        l.lieferantenname AS supplier_name,
        l.lieferantadress AS supplier_address,
        p.product_bezeichnung AS product_name,
        p.product_bezeichnung_markenname AS product_brand_name,
        p.specific_articlenumber AS recall_number,
        c.detailed_cause AS cause_details,
        prod.produzentname AS producer_name,
        v.version_date AS version_date,
        v.description AS version_description
      FROM rueckruf r
             LEFT JOIN lieferant l ON r.lieferant_id = l.liefranten_id
             LEFT JOIN product p ON r.product_id = p.product_id
             LEFT JOIN cause c ON r.cause_id = c.cause_id
             LEFT JOIN produzent prod ON r.produzent_id = prod.produzent_id
             LEFT JOIN versioncontrol v ON r.version_id = v.version_id
      WHERE r.rueckruf_id = $1;
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).send('Recall entry not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Add a new recall entry
app.post('/api/recalls', async (req, res) => {
  const {
    year, halfyear, month, day, prue_number, prue_freigabe,
    art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
    kassasperre, createkundeninfo, meldung, meldung_date,
    cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
    artsperr, anzahl_artsperr, formular, mandatar, note,
    cause_id, product_id, lieferant_id, produzent_id, version_id,
    rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
    rechnung_kontrolle
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO rueckruf (
        year, halfyear, month, day, prue_number, prue_freigabe,
        art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
        kassasperre, createkundeninfo, meldung, meldung_date,
        cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
        artsperr, anzahl_artsperr, formular, mandatar, note,
        cause_id, product_id, lieferant_id, produzent_id, version_id,
        rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
        rechnung_kontrolle
      ) VALUES (
                 $1,$2,$3,$4,$5,$6,
                 $7,$8,$9,$10,$11,$12,
                 $13,$14,$15,$16,
                 $17,$18,$19,$20,$21,$22,
                 $23,$24,$25,$26,$27,
                 $28,$29,$30,$31,$32,
                 $33,$34,$35,$36,
                 $37
               )`,
      [
        year, halfyear, month, day, prue_number, prue_freigabe,
        art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
        kassasperre, createkundeninfo, meldung, meldung_date,
        cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
        artsperr, anzahl_artsperr, formular, mandatar, note,
        cause_id, product_id, lieferant_id, produzent_id, version_id,
        rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
        rechnung_kontrolle
      ]
    );
    res.status(201).send('Recall added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to insert recall');
  }
});

// Lookup routes for dropdowns
app.get('/api/lieferanten', async (req, res) => {
  const result = await pool.query('SELECT liefranten_id, lieferantenname FROM lieferant');
  res.json(result.rows);
});

app.get('/api/produkte', async (req, res) => {
  const result = await pool.query('SELECT product_id, product_bezeichnung FROM product');
  res.json(result.rows);
});

app.get('/api/produzenten', async (req, res) => {
  const result = await pool.query('SELECT produzent_id, produzentname FROM produzent');
  res.json(result.rows);
});

app.get('/api/ursachen', async (req, res) => {
  const result = await pool.query('SELECT cause_id, detailed_cause FROM cause');
  res.json(result.rows);
});

app.get('/api/versionen', async (req, res) => {
  const result = await pool.query('SELECT version_id, version_date, description FROM versioncontrol');
  res.json(result.rows);
});

app.listen(3000, () => console.log('Server running on port 3000'));

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/recalls/upload-json', upload.single('file'), async (req, res) => {
  try {
    const jsonData = JSON.parse(req.file.buffer.toString());

    const {
      year, halfyear, month, day, prue_number, prue_freigabe,
      art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
      kassasperre, createkundeninfo, meldung, meldung_date,
      cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
      artsperr, anzahl_artsperr, formular, mandatar, note,
      cause_id, product_id, lieferant_id, produzent_id, version_id,
      rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
      rechnung_kontrolle
    } = jsonData;

    await pool.query(
      `INSERT INTO rueckruf (
        year, halfyear, month, day, prue_number, prue_freigabe,
        art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
        kassasperre, createkundeninfo, meldung, meldung_date,
        cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
        artsperr, anzahl_artsperr, formular, mandatar, note,
        cause_id, product_id, lieferant_id, produzent_id, version_id,
        rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
        rechnung_kontrolle
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,
        $17,$18,$19,$20,$21,$22,
        $23,$24,$25,$26,$27,
        $28,$29,$30,$31,$32,
        $33,$34,$35,$36,
        $37
      )`,
      [
        year, halfyear, month, day, prue_number, prue_freigabe,
        art, artdate, pi_income_date, type, is_marke, artikelanzahl_prue,
        kassasperre, createkundeninfo, meldung, meldung_date,
        cm, qm, bm, pm, bearbeitung_beginn, bearbeitung_ende,
        artsperr, anzahl_artsperr, formular, mandatar, note,
        cause_id, product_id, lieferant_id, produzent_id, version_id,
        rechnung_name, rechnung_betrag, rechnung_sprache, rechnung_ver_betrag,
        rechnung_kontrolle
      ]
    );

    res.status(201).send('Voller JSON-Eintrag erfolgreich eingefügt ✅');
  } catch (err) {
    console.error(err);
    res.status(400).send('Fehler beim Verarbeiten der JSON-Datei ❌');
  }
});
