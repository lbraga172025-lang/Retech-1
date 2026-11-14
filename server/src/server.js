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

// Verifica se o domínio possui estrutura DNS para receber e-mails.
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

async function dominioTemRotaDeEmail(email) {
  const dominio = email.split('@').pop();

  const mx = await consultarDns(resolveMx, dominio);

  if (mx.length > 0) {
    return true;
  }

  // Domínios sem MX podem receber e-mail por meio de registros A ou AAAA.
  const [ipv4, ipv6] = await Promise.all([
    consultarDns(resolve4, dominio),
    consultarDns(resolve6, dominio)
  ]);

  return ipv4.length > 0 || ipv6.length > 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

// Proteção administrativa.
function requireAdmin(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');

  if (!adminApiKey) {
    return res.status(503).json({
      error: 'Acesso administrativo ainda não configurado no servidor.'
    });
  }

  const providedKey = req.get('X-Admin-Key') || '';
  const providedBuffer = Buffer.from(providedKey);
  const expectedBuffer = Buffer.from(adminApiKey);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({
      error: 'Acesso não autorizado.'
    });
  }

  next();
}

// Teste da API e do banco.
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      database: 'connected',
      service: 'ReTech confirmation API'
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

// Recebe os dados e envia o e-mail.
app.post('/api/confirmacao', sendLimiter, async (req, res) => {
  try {
    if (!resend || !process.env.RESEND_FROM || !publicBaseUrl) {
      return res.status(503).json({
        error: 'Serviço de e-mail ainda não configurado. Tente novamente mais tarde.'
      });
    }

    const data = {
      nome: clean(req.body.nome, 80),
      email: clean(req.body.email, 120).toLowerCase(),
      telefone: clean(req.body.telefone, 20),
      data_contato: clean(req.body.data_contato, 10),
      quantidade:
        req.body.quantidade === '' || req.body.quantidade == null
          ? null
          : Number(req.body.quantidade),
      assunto: clean(req.body.assunto, 30),
      mensagem: clean(req.body.mensagem, 1000)
    };

    const assuntosPermitidos = [
      'duvida',
      'sugestao',
      'noticia',
      'acessibilidade',
      'outro'
    ];

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

    if (
      data.nome.length < 3 ||
      !emailOk ||
      !assuntosPermitidos.includes(data.assunto) ||
      data.mensagem.length < 10 ||
      req.body.ciencia !== true
    ) {
      return res.status(400).json({
        error: 'Confira seus dados e aceite o aviso de privacidade antes de enviar.'
      });
    }

    if (
      data.quantidade !== null &&
      (
        !Number.isInteger(data.quantidade) ||
        data.quantidade < 0 ||
        data.quantidade > 999
      )
    ) {
      return res.status(400).json({
        error: 'A quantidade deve ser um número inteiro entre 0 e 999.'
      });
    }

        // Verifica se o domínio pode receber e-mails.
    let dominioValido;

    try {
      dominioValido = await dominioTemRotaDeEmail(data.email);
    } catch (error) {
      console.error('Erro ao consultar DNS:', error);

      return res.status(503).json({
        error: 'Não foi possível verificar o domínio do e-mail agora. Tente novamente em instantes.'
      });
    }

    if (!dominioValido) {
      return res.status(400).json({
        error: 'O domínio deste e-mail não parece existir ou não está configurado para receber mensagens. Confira o endereço digitado.'
      });
    }
    
    const token = randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const now = Date.now();
    const expiresAt = now + 30 * 60 * 1000;

    await pool.query(
      'DELETE FROM pending_confirmations WHERE email = $1',
      [data.email]
    );

    await pool.query(
      `INSERT INTO pending_confirmations
        (email, token_hash, payload_json, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.email, tokenHash, JSON.stringify(data), expiresAt, now]
    );

    const link =
      `${publicBaseUrl}/confirmar-email.html?token=${token}`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: [data.email],
      subject: 'Confirme seu e-mail — ReTech',
      text:
        `Olá, ${data.nome}!\n\n` +
        'Para confirmar que este endereço é seu, acesse o link abaixo em até 30 minutos:\n' +
        `${link}\n\n` +
        'Se você não solicitou esta confirmação, ignore esta mensagem.',
      html:
        `<p>Olá, ${escapeHtml(data.nome)}!</p>` +
        '<p>Para confirmar que este endereço é seu, clique no botão abaixo. O link expira em 30 minutos.</p>' +
        `<p><a href="${link}">Confirmar meu e-mail</a></p>` +
        '<p>Se você não solicitou esta confirmação, ignore esta mensagem.</p>'
    });

    if (error) {
      await pool.query(
        'DELETE FROM pending_confirmations WHERE token_hash = $1',
        [tokenHash]
      );

      console.error('Resend error:', error);

      return res.status(502).json({
        error: 'Não foi possível enviar o e-mail agora. Tente novamente.'
      });
    }

    return res.status(202).json({
      message: 'E-mail de confirmação enviado.'
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Erro interno ao processar a solicitação.'
    });
  }
});

// Confirma o e-mail e salva o contato.
app.get('/api/confirmar', verifyLimiter, async (req, res) => {
  const client = await pool.connect();

  try {
    const token = clean(req.query.token, 128);

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).json({
        error: 'Link de confirmação inválido.'
      });
    }

    const tokenHash = sha256(token);

    await client.query('BEGIN');

    const result = await client.query(
      'SELECT * FROM pending_confirmations WHERE token_hash = $1 FOR UPDATE',
      [tokenHash]
    );

    const pending = result.rows[0];

    if (!pending) {
      await client.query('ROLLBACK');

      return res.status(404).json({
        error: 'Este link já foi utilizado ou não é válido. Solicite outro e-mail.'
      });
    }

    if (Number(pending.expires_at) < Date.now()) {
      await client.query(
        'DELETE FROM pending_confirmations WHERE token_hash = $1',
        [tokenHash]
      );

      await client.query('COMMIT');

      return res.status(410).json({
        error: 'O link expirou. Volte ao formulário e solicite uma nova confirmação.'
      });
    }

    const data = JSON.parse(pending.payload_json);

    await client.query(
      `INSERT INTO confirmed_contacts
        (nome, email, telefone, data_contato, quantidade, assunto, mensagem, confirmed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.nome,
        data.email,
        data.telefone || null,
        data.data_contato || null,
        data.quantidade,
        data.assunto,
        data.mensagem,
        Date.now()
      ]
    );

    await client.query(
      'DELETE FROM pending_confirmations WHERE token_hash = $1',
      [tokenHash]
    );

    await client.query('COMMIT');

    return res.json({
      message: 'E-mail confirmado.'
    });

  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(error);

    return res.status(500).json({
      error: 'Erro ao confirmar o e-mail.'
    });

  } finally {
    client.release();
  }
});

// Consulta administrativa dos contatos confirmados.
app.get(
  '/api/admin/contatos',
  adminLimiter,
  requireAdmin,
  async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          id,
          nome,
          email,
          telefone,
          data_contato,
          quantidade,
          assunto,
          mensagem,
          confirmed_at
        FROM confirmed_contacts
        ORDER BY confirmed_at DESC
        LIMIT 500
      `);

      return res.json({
        total: result.rows.length,
        contatos: result.rows
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Não foi possível consultar os contatos.'
      });
    }
  }
);

const server = app.listen(port, () => {
  console.log(`ReTech API listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
