import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'plugins', 'sovereign-alarms', 'android', 'com', 'sovereignworks', 'alarms');

for (const app of ['imperium', 'tending']) {
  const dest = path.join(root, 'apps', app, 'android', 'app', 'src', 'main', 'java', 'com', 'sovereignworks', 'alarms');
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    if (!file.endsWith('.kt')) continue;
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }
  console.log(`Synced native alarms -> ${app}`);
}
