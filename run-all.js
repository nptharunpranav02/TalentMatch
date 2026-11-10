const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', '   TALENTMATCH AI - FULL-STACK TRI-SERVICE RUNNER    ');
console.log('\x1b[36m%s\x1b[0m', '   Frontend (5173) • Backend (5000) • AI Engine (8000) ');
console.log('\x1b[36m%s\x1b[0m', '=======================================================\n');

const isWin = os.platform() === 'win32';
const processes = [];

function startProcess(name, cmd, args, cwd, colorCode) {
  const fullCmd = isWin && cmd.endsWith('.cmd') ? cmd : cmd;
  const child = spawn(fullCmd, args, {
    cwd: path.resolve(__dirname, cwd),
    shell: true,
    stdio: 'pipe'
  });

  const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m `;

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    lines.forEach(line => console.log(`${prefix}${line}`));
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    lines.forEach(line => console.log(`${prefix}${line}`));
  });

  child.on('close', (code) => {
    console.log(`${prefix}Process exited with code ${code}`);
  });

  processes.push(child);
  return child;
}

// 1. Determine Python / Uvicorn executable for AI Engine
let uvicornCmd = isWin 
  ? path.join('.venv', 'Scripts', 'uvicorn.exe') 
  : path.join('.venv', 'bin', 'uvicorn');

// Fallback to global uvicorn or python module if venv not at standard path
const fs = require('fs');
if (!fs.existsSync(path.resolve(__dirname, 'ai-engine', uvicornCmd))) {
  uvicornCmd = 'uvicorn';
}

console.log('🚀 Starting [1/3] FastAPI AI Engine on port 8000...');
startProcess('AI-ENGINE', uvicornCmd, ['app.main:app', '--host', '127.0.0.1', '--port', '8000'], 'ai-engine', '35'); // Magenta

console.log('🚀 Starting [2/3] Node.js Express Backend on port 5000...');
startProcess('BACKEND', 'node', ['server.js'], 'backend', '32'); // Green

console.log('🚀 Starting [3/3] React Vite Frontend on port 5173...');
startProcess('FRONTEND', isWin ? 'npm.cmd' : 'npm', ['run', 'dev'], 'frontend', '36'); // Cyan

// Graceful cleanup on Ctrl+C
function cleanup() {
  console.log('\n\x1b[33mStopping all TalentMatch services...\x1b[0m');
  processes.forEach(p => {
    try {
      if (isWin) {
        spawn('taskkill', ['/pid', p.pid, '/f', '/t']);
      } else {
        p.kill('SIGINT');
      }
    } catch {}
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('\n\x1b[32m✔ All services initialized!\x1b[0m');
console.log('👉 Web Application  : \x1b[4mhttp://localhost:5173/\x1b[0m');
console.log('👉 Backend Telemetry : \x1b[4mhttp://localhost:5000/api/health\x1b[0m');
console.log('👉 AI Engine Docs    : \x1b[4mhttp://127.0.0.1:8000/docs\x1b[0m');
console.log('\nPress Ctrl + C anytime to stop all servers.\n');
