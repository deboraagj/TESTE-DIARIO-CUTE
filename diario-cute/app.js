// app.js (CommonJS style)
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./db/index');
const diaryRoutes = require('./routes/diaryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// rota principal / (calendario) is in diaryRoutes
app.use('/', diaryRoutes);

// start
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🎉 Conectado ao MySQL');
    await sequelize.sync();
    console.log('🗂️ Tabelas sincronizadas');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  } catch (err) {
    console.error('Erro ao iniciar:', err);
  }
})();
