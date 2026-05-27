#!/usr/bin/env node
/**
 * Pre-build smoke checks for Imperium + Tending.
 * Run: node scripts/smoke-apps.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}
function ok(msg) {
  console.log(`OK: ${msg}`);
}

function checkApp(appName, opts) {
  const root = path.join(repo, 'apps', appName);
  console.log(`\n--- ${appName} ---`);

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const deps = { ...pkg.dependencies };

  if (deps['expo-clipboard']) fail(`${appName}: expo-clipboard must be removed`);
  else ok(`${appName}: no expo-clipboard`);

  if (deps['expo-av']) fail(`${appName}: expo-av must be removed`);
  else ok(`${appName}: no expo-av`);

  const sharing = deps['expo-sharing'] ?? '';
  if (!sharing.includes('56.')) fail(`${appName}: expo-sharing must be SDK 56 (${sharing})`);
  else ok(`${appName}: expo-sharing SDK 56`);

  const createSrc = fs.readFileSync(
    path.join(root, 'app/onboarding/create-household.tsx'),
    'utf8'
  );
  if (createSrc.includes('goToHouseholdCreated')) {
    fail(`${appName}: create-household must not navigate after create (inline success)`);
  } else if (!createSrc.includes('HouseholdCreatedPanel') || !createSrc.includes('setCreated')) {
    fail(`${appName}: create-household must use inline HouseholdCreatedPanel`);
  } else ok(`${appName}: inline household success (no post-create navigation)`);

  if (/pathname:\s*['"]/.test(createSrc)) {
    fail(`${appName}: create-household uses legacy pathname navigation`);
  }

  const routesSrc = fs.readFileSync(path.join(root, 'lib/routes.ts'), 'utf8');
  if (!routesSrc.includes('dismissAll') || !routesSrc.includes('./create-household')) {
    fail(`${appName}: lib/routes.ts missing dismissAll or relative onboarding paths`);
  } else ok(`${appName}: routes helper`);

  const metroSrc = fs.readFileSync(path.join(root, 'metro.config.js'), 'utf8');
  if (!metroSrc.includes('unstable_enablePackageExports = false')) {
    fail(`${appName}: metro.config.js missing Firebase auth fix (package exports)`);
  } else if (!metroSrc.includes("sourceExts.push('cjs')")) {
    fail(`${appName}: metro.config.js missing cjs extension for Firebase`);
  } else ok(`${appName}: Metro Firebase auth config`);

  const layoutSrc = fs.readFileSync(path.join(root, 'app/_layout.tsx'), 'utf8');
  if (!layoutSrc.includes('GestureHandlerRootView')) {
    fail(`${appName}: root layout missing GestureHandlerRootView`);
  } else ok(`${appName}: GestureHandlerRootView`);

  const tabDir = path.join(root, 'app/(tabs)');
  if (fs.existsSync(path.join(tabDir, 'two.tsx'))) {
    fail(`${appName}: orphan (tabs)/two.tsx`);
  }

  if (opts.firebaseAppId && fs.existsSync(path.join(root, '.env'))) {
    const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
    if (!env.includes(opts.firebaseAppId)) {
      fail(`${appName}: .env missing Android app id ${opts.firebaseAppId}`);
    } else ok(`${appName}: Firebase Android app id`);
  }
}

checkApp('imperium', { firebaseAppId: 'android:302a6967f405d693071f02' });
checkApp('tending', { firebaseAppId: 'android:36aebbf0cfd9c1c1071f02' });

const sharedCreate = fs.readFileSync(
  path.join(repo, 'packages/shared/src/screens/HouseholdCreatedPanel.tsx'),
  'utf8'
);
if (sharedCreate.includes('watchHousehold')) ok('shared: HouseholdCreatedPanel');
else fail('shared: missing HouseholdCreatedPanel');

if (failed > 0) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
