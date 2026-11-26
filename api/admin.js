'use strict';

const { createHash, timingSafeEqual } = require('node:crypto');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const USERNAME = 'MSantoni';
const ADMIN_PAGE = join(__dirname, '..', 'admin.html');

function digest(value) {
  return createHash('sha256').update(value).digest();
}

module.exports = async function admin(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return response.status(503).send('Painel temporariamente indisponível.');
  }

  const credentials = /^Basic +([A-Za-z0-9+/]+={0,2})$/i.exec(request.headers.authorization ?? '');
  if (!credentials || !timingSafeEqual(
    digest(credentials[1]),
    digest(Buffer.from(`${USERNAME}:${password}`, 'utf8').toString('base64'))
  )) {
    response.setHeader('WWW-Authenticate', 'Basic realm="Painel administrativo", charset="UTF-8"');
    return response.status(401).send('Acesso restrito ao painel.');
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).end();
  }

  const page = await readFile(ADMIN_PAGE, 'utf8');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  return response.status(200).end(request.method === 'HEAD' ? undefined : page);
};
