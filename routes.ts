import express from 'express';
import { Utente, Veicolo, Varco, Tratta, Transito, Multa } from './models';

const router = express.Router();

// Rotte per gestire i varchi
router.post('/varchi', async (req, res) => {
  const varco = await Varco.create(req.body);
  res.status(201).json(varco);
});

router.get('/varchi', async (req, res) => {
  const varchi = await Varco.findAll();
  res.json(varchi);
});

router.get('/varchi/:id', async (req, res) => {
  const varco = await Varco.findByPk(req.params.id);
  if (varco) {
    res.json(varco);
  } else {
    res.status(404).send('Varco non trovato');
  }
});

router.put('/varchi/:id', async (req, res) => {
  const varco = await Varco.findByPk(req.params.id);
  if (varco) {
    await varco.update(req.body);
    res.json(varco);
  } else {
    res.status(404).send('Varco non trovato');
  }
});

router.delete('/varchi/:id', async (req, res) => {
  const varco = await Varco.findByPk(req.params.id);
  if (varco) {
    await varco.destroy();
    res.status(204).send();
  } else {
    res.status(404).send('Varco non trovato');
  }
});

// Rotte per le altre entità (tratte, veicoli, transiti) seguono lo stesso schema

export default router;
