```js
import { resolveMx, resolve4, resolve6 } from 'node:dns/promises';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import { Resend } from 'resend';
import {
  randomBytes,
  createHash,
  timingSafeEqual
} from 'node:crypto';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3000);

// Configuração para o proxy do Render.
app.set('trust proxy', 1);

const frontendOrigin = process.env.FRONTEND_ORIGIN || '';
const publicBaseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const adminApiKey = process.env.ADMIN_API_KEY || '';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não foi configurada.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Cria as tabelas automaticamente.
await pool.query(`
  CREATE TABLE IF NOT EXISTS pending_confirmations (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    payload_json TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    created_at BIGINT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS confirmed_contacts (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    data_contato TEXT,
    quantidade INTEGER,
    assunto TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    confirmed_at BIGINT NOT NULL
  );
`);

app.use(helmet());
app.use(express.json({ limit: '20kb' }));

// CORS
app.use((req, res, next) => {
  if (frontendOrigin && req.headers.origin === frontendOrigin) {
    res.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, X-Admin-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const sha256 = (value) =>
  createHash('sha256').update(value).digest('hex');

const clean = (value, max) =>
  String(value ?? '').trim().slice(0, max);

// Verifica registros DNS do domínio.
async function consultarDns(resolver, dominio) {
  try {
    return await resolver(dominio);
  } catch (error) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return [];
    }

    throw error;
  }
}

// Verifica se o domínio possui estrutura para receber e-mails.
async function dominioTemRotaDeEmail(email) {
  const dominio = email.split('@').pop();

  const mx = await consultarDns(resolveMx, dominio);

  if (mx.length > 0) {
    return !mx.some(registro => registro.exchange === '.');
  }

  const [ipv4, ipv6] = await Promise.all([
    consultarDns(resolve4, dominio),
    consultarDns(resolve6, dominio)
  ]);

  return
