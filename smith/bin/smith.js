#!/usr/bin/env node

import readline from 'readline';
import { spawn } from 'child_process';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const url = process.argv[2];

async function main() {
  const appUrl = url || await ask('App URL: ');
  rl.close();

  if (!appUrl.trim()) {
    console.error('URL is required.');
    process.exit(1);
  }

  const proc = spawn('claude', [`run smith on ${appUrl.trim()}`], { stdio: 'inherit' });

  proc.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.error('Claude Code CLI not found. Install it from: https://claude.ai/code');
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });

  proc.on('exit', (code) => process.exit(code || 0));
}

main();
