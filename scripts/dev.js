const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

// Locate Maven on Windows if not globally available
if (isWindows) {
  try {
    const { execSync } = require('child_process');
    execSync('where.exe mvn', { stdio: 'ignore' });
  } catch (e) {
    const userProfile = process.env.USERPROFILE || '';
    if (userProfile) {
      const extensionsDir = path.join(userProfile, '.vscode', 'extensions');
      if (fs.existsSync(extensionsDir)) {
        const dirs = fs.readdirSync(extensionsDir);
        const javaExtDir = dirs.find(d => d.startsWith('oracle.oracle-java-'));
        if (javaExtDir) {
          const mavenBinDir = path.join(extensionsDir, javaExtDir, 'nbcode', 'java', 'maven', 'bin');
          if (fs.existsSync(path.join(mavenBinDir, 'mvn.cmd'))) {
            process.env.PATH = mavenBinDir + path.delimiter + process.env.PATH;
            console.log(`[dev.js] Found Maven in VS Code extension: ${mavenBinDir}`);
          }
        }
      }
    }
  }
}

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

const npmCommand = isWindows ? 'npm.cmd' : 'npm';
spawnProcess('backend', 'mvn', ['-f', path.join('backend', 'pom.xml'), 'spring-boot:run'], rootDir);
spawnProcess('mock-api', 'node', [path.join('scripts', 'mock-api.js')], rootDir);
spawnProcess('frontend', npmCommand, ['run', 'dev', '--prefix', 'frontend'], rootDir);

