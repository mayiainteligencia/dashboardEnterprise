// routes/monitorRoutes.js
const MONITOR_URL = 'http://localhost:8001';

// ── POST /api/monitor/start ──────────────────────────────────────────
async function start(req, res) {
  try {
    const response = await fetch(`${MONITOR_URL}/monitor/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Microservicio de monitoreo no disponible', detalle: err.message });
  }
}

// ── DELETE /api/monitor/stop/:sesionId ──────────────────────────────
async function stop(req, res) {
  try {
    const response = await fetch(`${MONITOR_URL}/monitor/stop/${req.params.sesionId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Microservicio de monitoreo no disponible', detalle: err.message });
  }
}

// ── GET /api/monitor/sessions ────────────────────────────────────────
async function sessions(req, res) {
  try {
    const response = await fetch(`${MONITOR_URL}/monitor/sessions`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Microservicio de monitoreo no disponible', detalle: err.message });
  }
}

// ── GET /api/monitor/testigos?sesion_id=xxx ──────────────────────────
async function testigos(req, res) {
  try {
    const params = req.query.sesion_id ? `?sesion_id=${req.query.sesion_id}` : '';
    const response = await fetch(`${MONITOR_URL}/monitor/testigos${params}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Microservicio de monitoreo no disponible', detalle: err.message });
  }
}

import express from 'express';
const router = express.Router();

router.post('/start', start);
router.delete('/stop/:sesionId', stop);
router.get('/sessions', sessions);
router.get('/testigos', testigos);

export default router;