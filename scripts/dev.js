const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

const processes = [];

const spawnProcess = (name, command, args, cwd) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGINT') {
      console.error(`[${name}] exited with code ${code ?? 'null'}${signal ? ` signal ${signal}` : ''}`);
      shutdown(1);
    }
  });

  processes.push(child);
  return child;
};

const shutdown = (exitCode = 0) => {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(exitCode);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

spawnProcess('backend', 'mvn', ['-f', path.join('backend', 'pom.xml'), 'spring-boot:run'], rootDir);
spawnProcess('frontend', 'npm', ['run', 'dev', '--prefix', 'frontend'], rootDir);
spawnProcess('frontend', 'npm', ['run', 'dev', '--prefix', 'frontend'], rootDir);
