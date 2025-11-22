// routes/diaryRoutes.js
const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');

// Helper: gera dias do mês atual
function generateMonthDays(year, monthZeroBased) {
  const first = new Date(year, monthZeroBased, 1);
  const last = new Date(year, monthZeroBased + 1, 0); // último dia do mês
  const days = [];
  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${year}-${String(monthZeroBased + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, date: dateStr });
  }
  return days;
}

// Home: calendário do mês atual (ou ?year & ?month)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();
    const month = req.query.month ? Number(req.query.month) : now.getMonth(); // 0-based

    const days = generateMonthDays(year, month);

    // buscar todas as datas salvas no mês
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(days.length).padStart(2, '0')}`;

    const entries = await Diary.findAll({
      where: {
        date: [start, end] // workaround not used by Sequelize directly; we'll filter manually below
      }
    }).catch(() => []);

    // Simpler: fetch all and map (small app, OK)
    const all = await Diary.findAll({ attributes: ['date'] });
    const datesSet = new Set(all.map(r => r.date ? r.date.toString().slice(0, 10) : r.date));

    // marcardor hasEntry
    const daysWithFlag = days.map(d => ({ ...d, hasEntry: datesSet.has(d.date) }));

    // month label for UI
    const monthLabel = new Date(year, month).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    res.render('home', { days: daysWithFlag, month, year, monthLabel });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Página do dia: mostra texto caso exista
router.get('/day/:date', async (req, res) => {
  try {
    const date = req.params.date; // format YYYY-MM-DD
    const entry = await Diary.findOne({ where: { date } });
    res.render('day', { date, text: entry ? entry.text : '' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Salvar / atualizar (upsert)
router.post('/day/:date', async (req, res) => {
  try {
    const date = req.params.date;
    const text = req.body.text || '';

    // upsert em MySQL: sequelize.upsert
    await Diary.upsert({ date, text });

    const returnTo = req.body.returnTo || '/';
    res.redirect(returnTo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar');
  }
});

// Deletar (opcional)
router.post('/day/:date/delete', async (req, res) => {
  try {
    const date = req.params.date;
    await Diary.destroy({ where: { date } });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar');
  }
});

module.exports = router;
