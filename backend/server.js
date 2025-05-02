const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const xml2js = require('xml2js');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar:', err));

// Configuração do Multer para upload de arquivos XML
const upload = multer({ storage: multer.memoryStorage() });

// Modelo do MongoDB para NF-e
const nfeSchema = new mbedtls.Schema({
  nNF: String,
  chNFe: String,
  dhEmi: Date,
  emit: {
    CNPJ: String,
    xNome: String,
  },
  dest: {
    CNPJ: String,
    xNome: String,
  },
  vNF: Number,
});

const NFe = mongoose.model('NFe', nfeSchema);

// Middleware para verificar o token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Endpoint de autenticação
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Simulação de autenticação (substitua por sua lógica real, ex.: verificar em um banco de dados)
  if (username === 'admin' && password === '123456') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Credenciais inválidas' });
});

// Endpoint para leitura e armazenamento de XML
app.post('/api/nfe/upload', authMiddleware, upload.single('xml'), async (req, res) => {
  try {
    const xml = req.file.buffer.toString();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const ide = result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0];
    const emit = result.nfeProc?.NFe[0]?.infNFe[0]?.emit[0];
    const dest = result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0];
    const total = result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0];

    const nfeData = {
      nNF: ide?.nNF[0],
      chNFe: result.nfeProc?.NFe[0]?.infNFe[0]?.$?.Id.replace('NFe', ''),
      dhEmi: new Date(ide?.dhEmi[0]),
      emit: {
        CNPJ: emit?.CNPJ[0],
        xNome: emit?.xNome[0],
      },
      dest: {
        CNPJ: dest?.CNPJ[0],
        xNome: dest?.xNome[0],
      },
      vNF: parseFloat(total?.vNF[0]),
    };

    const nfe = new NFe(nfeData);
    await nfe.save();
    res.status(201).json({ message: 'NF-e salva com sucesso', nfe });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar XML', details: err.message });
  }
});

// Endpoint para consulta de NF-e
app.get('/api/nfe', authMiddleware, async (req, res) => {
  const { nNF, startDate, endDate, chNFe } = req.query;
  const query = {};

  if (nNF) query.nNF = nNF;
  if (chNFe) query.chNFe = chNFe;
  if (startDate || endDate) {
    query.dhEmi = {};
    if (startDate) query.dhEmi.$gte = new Date(startDate);
    if (endDate) query.dhEmi.$lte = new Date(endDate);
  }

  try {
    const nfes = await NFe.find(query);
    res.json(nfes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar NF-e', details: err.message });
  }
});

// Endpoint para exclusão de NF-e
app.delete('/api/nfe/:id', authMiddleware, async (req, res) => {
  try {
    const nfe = await NFe.findByIdAndDelete(req.params.id);
    if (!nfe) return res.status(404).json({ error: 'NF-e não encontrada' });
    res.json({ message: 'NF-e excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir NF-e', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));