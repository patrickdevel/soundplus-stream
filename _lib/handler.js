const { SoundCloudClient } = require('../index.js');
const client = new SoundCloudClient(); // bleibt zwischen Aufrufen im warmen Container erhalten

// fn(client, query) -> Ergebnis. Optionaler Zugriffsschutz über Umgebungsvariable ACCESS_KEY.
module.exports = fn => async (req, res) => {
  const key = process.env.ACCESS_KEY;
  if (key && req.headers['x-key'] !== key) return res.status(401).json({ error: 'Falscher Zugriffscode' });
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(await fn(client, req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
