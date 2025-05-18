// server.js - Versão atualizada
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const xml2js = require('xml2js');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar:', err));

// Configuração do Multer para upload de arquivos
const upload = multer({ storage: multer.memoryStorage() });

// Modelo do Usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Modelo do Log de Ações
const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nfeId: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

// Modelo do MongoDB para NF-e (atualizado)
const nfeSchema = new mongoose.Schema({
  nNF: { type: String, required: true },
  chNFe: { type: String, required: true, unique: true },
  dhEmi: { type: Date, required: true },
  dhReg: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emitter: {
    CNPJ: { type: String, required: true },
    xNome: { type: String, required: true },
  },
  dest: {
    CNPJ: { type: String },
    xNome: { type: String },
  },
  vNF: { type: Number },
  xml: { type: String }, // Armazenar XML completo como string
  xmlBase64: { type: String } // Opcional: armazenar como base64
});

const NFe = mongoose.model('NFe', nfeSchema);

// Middleware para verificar o token
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Função para criar log
const createLog = async (userId, action, nfeId = null, details = {}) => {
  await Log.create({ userId, action, nfeId, details });
};

// Endpoint de autenticação
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    await createLog(user._id, 'LOGIN');
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Endpoint para cadastro de usuários (apenas admin)
app.post('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    
    await createLog(req.user._id, 'CREATE_USER', null, { username, role });
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint para leitura e armazenamento de XML (arquivo)
app.post('/api/nfe/upload', authMiddleware, upload.single('xml'), async (req, res) => {
  try {
    const xml = req.file.buffer.toString();
    await processAndSaveNFe(req.user, xml, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar XML', details: err.message });
  }
});

// Endpoint para leitura e armazenamento de XML (raw)
app.post('/api/nfe/upload-raw', authMiddleware, async (req, res) => {
  try {
    const { xml } = req.body;
    if (!xml) return res.status(400).json({ error: 'XML não fornecido' });
    
    await processAndSaveNFe(req.user, xml, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar XML', details: err.message });
  }
});

// Endpoint para leitura e armazenamento de XML (base64)
app.post('/api/nfe/upload-base64', authMiddleware, async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ error: 'Base64 não fornecido' });
    
    const xml = Buffer.from(base64, 'base64').toString('utf-8');
    await processAndSaveNFe(req.user, xml, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar XML', details: err.message });
  }
});

// Função auxiliar para processar e salvar NF-e
async function processAndSaveNFe(user, xml, res) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);

  const ide = result.nfeProc?.NFe[0]?.infNFe[0]?.ide[0];
  const emitter = result.nfeProc?.NFe[0]?.infNFe[0]?.emit[0];
  const dest = result.nfeProc?.NFe[0]?.infNFe[0]?.dest[0];
  const total = result.nfeProc?.NFe[0]?.infNFe[0]?.total[0]?.ICMSTot[0];

  const chNFe = result.nfeProc?.NFe[0]?.infNFe[0]?.$?.Id.replace('NFe', '');

  // Verifica se NF-e já existe
  const existingNFe = await NFe.findOne({ chNFe });
  if (existingNFe) {
    return res.status(400).json({ error: 'NF-e já existe no sistema' });
  }

  const nfeData = {
    nNF: ide?.nNF[0],
    chNFe,
    dhEmi: new Date(ide?.dhEmi[0]),
    userId: user._id,
    emitter: {
      CNPJ: emitter?.CNPJ[0],
      xNome: emitter?.xNome[0],
    },
    dest: {
      CNPJ: dest?.CNPJ[0],
      xNome: dest?.xNome[0],
    },
    vNF: parseFloat(total?.vNF[0]),
    xml,
    xmlBase64: Buffer.from(xml).toString('base64')
  };

  const nfe = new NFe(nfeData);
  await nfe.save();
  
  await createLog(user._id, 'UPLOAD_NFE', chNFe);
  res.status(201).json({ message: 'NF-e salva com sucesso', nfe });
}

// Endpoint para consulta de NF-e
app.get('/api/nfe', authMiddleware, async (req, res) => {
  const { nNF, startDate, endDate, chNFe, userId } = req.query;
  const query = {};

  if (nNF) query.nNF = nNF;
  if (chNFe) query.chNFe = chNFe;
  if (userId) query.userId = userId;
  
  if (startDate || endDate) {
    query.dhReg = {};
    if (startDate) query.dhReg.$gte = new Date(startDate);
    if (endDate) query.dhReg.$lte = new Date(endDate);
  }

  try {
    const nfes = await NFe.find(query).populate('userId', 'username');
    await createLog(req.user._id, 'QUERY_NFE');
    res.json(nfes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar NF-e', details: err.message });
  }
});

// Endpoint para consulta de logs
app.get('/api/logs', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { action, userId, startDate, endDate } = req.query;
    const query = {};

    if (action) query.action = action;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await Log.find(query).populate('userId', 'username').sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar logs', details: err.message });
  }
});

// Endpoint para exclusão de NF-e
app.delete('/api/nfe/:id', authMiddleware, async (req, res) => {
  try {
    const nfe = await NFe.findById(req.params.id);
    if (!nfe) return res.status(404).json({ error: 'NF-e não encontrada' });

    // Verifica se o usuário tem permissão (admin ou dono da NF-e)
    if (req.user.role !== 'admin' && !nfe.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await nfe.remove();
    await createLog(req.user._id, 'DELETE_NFE', nfe.chNFe);
    
    res.json({ message: 'NF-e excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir NF-e', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));