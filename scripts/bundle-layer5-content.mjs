/**
 * Bundles verbatim spec markdown into TypeScript modules for Layer 5 screens.
 * Run: node scripts/bundle-layer5-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specDir = path.join(root, 'spec');
const outDir = path.join(root, 'packages', 'shared', 'src', 'content', 'layer5');

const files = [
  { src: 'WARRIORS_PRACTICE.md', export: 'WARRIORS_PRACTICE' },
  { src: 'TENDING_PRACTICE.md', export: 'KEEPERS_PRACTICE' },
  { src: 'HOLY_BOOK.md', export: 'HOLY_BOOK' },
  { src: 'VELNAR_LANGUAGE_GUIDE.md', export: 'VELNAR_GUIDE' },
  { src: 'CEREMONIES_AND_OBSERVANCES.md', export: 'CEREMONIES' },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { src, export: name } of files) {
  const text = fs.readFileSync(path.join(specDir, src), 'utf8');
  const out = `/** Auto-generated from spec/${src} — do not edit. Re-run bundle-layer5-content.mjs */\nexport const ${name} = ${JSON.stringify(text)};\n`;
  fs.writeFileSync(path.join(outDir, `${name}.ts`), out, 'utf8');
  console.log(`Wrote ${name}.ts (${text.length} chars)`);
}

// Holy book movement index
const holy = fs.readFileSync(path.join(specDir, 'HOLY_BOOK.md'), 'utf8');
const movements = [];
const re = /^# MOVEMENT ([IVX]+) — (.+)$/gm;
let m;
while ((m = re.exec(holy)) !== null) {
  const roman = m[1];
  const title = m[2].trim();
  const unlockDay =
    roman === 'I' || roman === 'II' ? 1 : roman === 'III' || roman === 'IV' ? 7 : roman === 'V' || roman === 'VI' ? 30 : 90;
  movements.push({ id: roman, title, unlockDay });
}
const indexOut = `/** Auto-generated movement index */\nexport const HOLY_BOOK_MOVEMENTS = ${JSON.stringify(movements, null, 2)} as const;\n`;
fs.writeFileSync(path.join(outDir, 'holyBookIndex.ts'), indexOut, 'utf8');
console.log(`Wrote holyBookIndex.ts (${movements.length} movements)`);
