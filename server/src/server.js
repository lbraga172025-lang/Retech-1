import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Database from 'better-sqlite3';
import { Resend } from 'resend';
import { randomBytes, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const app = express();
const port = Number(process.env.PORT || 3000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || '';
const publicBaseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const dbPath = process.env.DB_PATH || './data/retech.sqlite';
mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS pending_confirmations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    payload_json TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS confirmed_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    data_contato TEXT,
    quantidade INTEGER,
    assunto TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    confirmed_at INTEGER NOT NULL
  );
`);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  if (frontendOrigin && req.headers.origin === frontendOrigin) {
    res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
const sendLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const clean = (value, max) => String(value ?? '').trim().slice(0, max);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'ReTech confirmation API' }));

app.post('/api/confirmacao', sendLimiter, async (req, res) => {
  try {
    if (!resend || !process.env.RESEND_FROM || !publicBaseUrl) {
      return res.status(503).json({ error: 'Serviço de e-mail ainda não configurado. Tente novamente mais tarde.' });
    }
    const data = {
      nome: clean(req.body.nome, 80),
      email: clean(req.body.email, 120).toLowerCase(),
      telefone: clean(req.body.telefone, 20),
      data_contato: clean(req.body.data_contato, 10),
      quantidade: req.body.quantidade === '' || req.body.quantidade == null ? null : Number(req.body.quantidade),
      assunto: clean(req.body.assunto, 30),
      mensagem: clean(req.body.mensagem, 1000)
    };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (data.nome.length < 3 || !emailOk || !data.assunto || data.mensagem.length < 10) {
      return res.status(400).json({ error: 'Confira nome, e-mail, assunto e mensagem antes de enviar.' });
    }
    if (data.quantidade !== null && (!Number.isInteger(data.quantidade) || data.quantidade < 0 || data.quantidade > 999)) {
      return res.status(400).json({ error: 'A quantidade deve ser um número inteiro entre 0 e 999.' });
    }
    const token = randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const now = Date.now();
    const expiresAt = now + 30 * 60 * 1000;
    db.prepare('DELETE FROM pending_confirmations WHERE email = ?').run(data.email);
    db.prepare(`INSERT INTO pending_confirmations (email, token_hash, payload_json, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)`).run(data.email, tokenHash, JSON.stringify(data), expiresAt, now);
    const link = `${publicBaseUrl}/confirmar-email.html?token=${token}`;
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [data.email],
      subject: 'Confirme seu e-mail — ReTech',
      text: `Olá, ${data.nome}!\n\nPara confirmar que este endereço é seu, acesse o link abaixo em até 30 minutos:\n${link}\n\nSe você não solicitou esta confirmação, ignore esta mensagem.`,
      html: `<p>Olá, ${escapeHtml(data.nome)}!</p><p>Para confirmar que este endereço é seu, clique no botão abaixo. O link expira em 30 minutos.</p><p><a href="${link}">Confirmar meu e-mail</a></p><p>Se você não solicitou esta confirmação, ignore esta mensagem.</p>`
    });
    if (error) {
      db.prepare('DELETE FROM pending_confirmations WHERE token_hash = ?').run(tokenHash);
      console.error('Resend error:', error);
      return res.status(502).json({ error: 'Não foi possível enviar o e-mail agora. Tente novamente.' });
    }
    return res.status(202).json({ message: 'E-mail de confirmação enviado.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
});

app.get('/api/confirmar', verifyLimiter, (req, res) => {
  const token = clean(req.query.token, 128);
  if (!/^[a-f0-9]{64}$/.test(token)) return res.status(400).json({ error: 'Link de confirmação inválido.' });
  const tokenHash = sha256(token);
  const pending = db.prepare('SELECT * FROM pending_confirmations WHERE token_hash = ?').get(tokenHash);
  if (!pending) return res.status(404).json({ error: 'Este link já foi utilizado ou não é válido. Solicite outro e-mail.' });
  if (pending.expires_at < Date.now()) {
    db.prepare('DELETE FROM pending_confirmations WHERE token_hash = ?').run(tokenHash);
    return res.status(410).json({ error: 'O link expirou. Volte ao formulário e solicite uma nova confirmação.' });
  }
  const data = JSON.parse(pending.payload_json);
  db.prepare(`INSERT INTO confirmed_contacts
    (nome, email, telefone, data_contato, quantidade, assunto, mensagem, confirmed_at)
    VALUES (@nome, @email, @telefone, @data_contato, @quantidade, @assunto, @mensagem, @confirmed_at)`)
    .run({ ...data, confirmed_at: Date.now() });
  db.prepare('DELETE FROM pending_confirmations WHERE token_hash = ?').run(tokenHash);
  return res.json({ message: 'E-mail confirmado.' });
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

app.listen(port, () => console.log(`ReTech API listening on port ${port}`));
