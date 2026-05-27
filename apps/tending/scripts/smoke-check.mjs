#!/usr/bin/env node
/**
 * Static smoke checks for Tending (run: node apps/tending/scripts/smoke-check.mjs)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}
function ok(msg) {
  console.log(`OK: ${msg}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

if (deps['expo-clipboard']) fail('expo-clipboard must not be installed (SDK 56 crash)');
else ok('no expo-clipboard');

if (deps['expo-av']) fail('expo-av must not be installed');
else ok('no expo-av');

const sharing = deps['expo-sharing'] ?? '';
if (!sharing.includes('56.')) fail(`expo-sharing should be SDK 56, got ${sharing}`);
else ok('expo-sharing SDK 56');

const tabDir = path.join(root, 'app', '(tabs)');
const tabFiles = fs
  .readdirSync(tabDir)
  .filter((f) => f.endsWith('.tsx') && f !== '_layout.tsx')
  .map((f) => f.replace('.tsx', ''));

const layout = fs.readFileSync(path.join(tabDir, '_layout.tsx'), 'utf8');
const requiredTabs = ['index', 'planner', 'nourish', 'more', 'keep', 'doctrine'];
for (const name of requiredTabs) {
  if (!tabFiles.includes(name)) fail(`missing tab file ${name}.tsx`);
}
if (!layout.includes('TAB_CONFIG.tending') || !layout.includes('tabs.map')) {
  fail('tabs layout must register TAB_CONFIG.tending screens');
}
for (const name of ['keep', 'doctrine']) {
  if (!layout.includes(`name="${name}"`)) fail(`tabs layout missing hidden Screen name="${name}"`);
}
if (tabFiles.includes('two')) fail('orphan (tabs)/two.tsx must be removed');
else ok('tab routes aligned with layout');

for (const file of [
  'lib/routes.ts',
  'app/onboarding/create-household.tsx',
  'app/onboarding/household-created.tsx',
]) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  if (src.includes('pathname:')) fail(`${file} uses legacy pathname navigation`);
  if (src.includes('expo-clipboard')) fail(`${file} imports expo-clipboard`);
}
ok('onboarding navigation uses string hrefs');

const envPath = path.join(root, '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  if (!env.includes('android:36aebbf0cfd9c1c1071f02')) {
    fail('.env should use Tending Android Firebase app ID');
  } else ok('Tending Android Firebase app ID in .env');
} else fail('missing apps/tending/.env');

if (failed > 0) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll Tending smoke checks passed.');
