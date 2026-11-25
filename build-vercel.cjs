'use strict';

const { copyFileSync, cpSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const output = join(__dirname, 'vercel-static');
mkdirSync(output, { recursive: true });
copyFileSync(join(__dirname, 'index.html'), join(output, 'index.html'));
cpSync(join(__dirname, 'assets'), join(output, 'assets'), { recursive: true });
