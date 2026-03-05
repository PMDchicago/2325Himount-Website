import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export function getSiteConfig() {
  const p = path.join(process.cwd(), 'content', 'site.yaml');
  const raw = fs.readFileSync(p, 'utf8');
  return yaml.load(raw);
}

export function getUnits() {
  const p = path.join(process.cwd(), 'content', 'units.yaml');
  const raw = fs.readFileSync(p, 'utf8');
  const data = yaml.load(raw);
  return data?.units || [];
}
