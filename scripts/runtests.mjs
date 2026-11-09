// Clean, candidate-facing test runner. Runs the frontend + backend tests and shows a simple
// pass/fail summary parsed from their JUnit-XML reports — no raw vitest/Maven noise.
// Wired to the "Run tests" button.
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const G = '\x1b[32m', R = '\x1b[31m', DIM = '\x1b[90m', B = '\x1b[1m', X = '\x1b[0m';

const NODE_BIN = process.env.HH_NODE_BIN || '/opt/hh/node-runtime/bin';
const MAVEN_REPOSITORY = process.env.HH_MAVEN_CACHE ? `${process.env.HH_MAVEN_CACHE}/repository` : '';
const run = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, PATH: `${NODE_BIN}:${process.env.PATH}` } });
const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&#10;/g, ' ').replace(/&amp;/g, '&');
const humanize = (n) => n.replace(/^test/i, '').replace(/[._]/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim() || n;

function parseJUnit(xml) {
  const cases = [];
  const re = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const attrs = m[1], body = m[3] || '';
    const name = dec((attrs.match(/\bname="([^"]*)"/) || [])[1] || '?');   // \b avoids matching classname=
    const failed = /<failure\b|<error\b/.test(body);
    const msg = dec((body.match(/<(?:failure|error)[^>]*message="([^"]*)"/) || [])[1] || '').replace(/\s+/g, ' ').trim();
    cases.push({ name, pass: !failed, msg });
  }
  return cases;
}

function suite(label, hint, runner, reportFinder) {
  process.stdout.write(`${B}${label}${X} ${DIM}${hint}${X} `);
  const r = runner();
  const cases = reportFinder();
  console.log(cases.length ? 'done' : (r.status === 0 ? 'done' : `${R}could not run${X}`));
  return { cases, out: (r.stdout || '') + (r.stderr || ''), code: r.status };
}

console.log('\nRunning tests…\n');

// Frontend (fast)
const fe = suite('React (frontend)', '', () => run('npm', ['run', 'test'], join(ROOT, 'app')), () => {
  const p = join(ROOT, 'app', 'junit-reports', 'junit.xml');
  return existsSync(p) ? parseJUnit(readFileSync(p, 'utf8')) : [];
});

// Backend (compiles + runs — slower)
const be = suite('Spring (backend)', 'compiling + running, ~30s', () => run('mvn', ['-o', ...(MAVEN_REPOSITORY ? [`-Dmaven.repo.local=${MAVEN_REPOSITORY}`] : []), '-q', 'test'], join(ROOT, 'server')), () => {
  const dir = join(ROOT, 'server', 'target', 'surefire-reports');
  let c = [];
  if (existsSync(dir)) for (const f of readdirSync(dir).filter((f) => f.endsWith('.xml'))) c = c.concat(parseJUnit(readFileSync(join(dir, f), 'utf8')));
  return c;
});

function show(title, s) {
  console.log(`\n${B}${title}${X}`);
  if (!s.cases.length) {
    // No report means the runner itself could not complete. Surface the key line, not the whole dump.
    const line = (s.out.split('\n').find((l) => /ERROR.*\.java:|cannot find symbol|BUILD FAILURE|error TS\d/.test(l)) || '').trim();
    console.log(`  ${R}✗ test runner could not complete${X}${line ? `\n    ${DIM}${line.replace(/\[ERROR\]\s*/, '')}${X}` : ''}`);
    return;
  }
  for (const c of s.cases) {
    if (c.pass) console.log(`  ${G}✓${X} ${humanize(c.name)}`);
    else console.log(`  ${R}✗${X} ${humanize(c.name)}${c.msg ? `\n      ${DIM}${c.msg}${X}` : ''}`);
  }
}
show('React (frontend)', fe);
show('Spring (backend)', be);

const all = [...fe.cases, ...be.cases];
const passed = all.filter((c) => c.pass).length;
const unavailableSuites = [fe, be].filter((suite) => !suite.cases.length).length;
const failed = all.filter((c) => !c.pass).length + unavailableSuites;
const ok = failed === 0 && all.length > 0;
console.log(`\n${B}${ok ? G : R}${passed} passed, ${failed} failed${X}  ${DIM}(${all.length} reported tests)${X}\n`);
// The HireHunch task integration uses the terminal process status as the machine-readable result.
// A pretty failure summary without this would incorrectly report success to the platform.
process.exitCode = ok ? 0 : 1;
