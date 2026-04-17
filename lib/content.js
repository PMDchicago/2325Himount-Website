import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

function readFileSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function readYaml(relPath) {
  const fullPath = path.join(CONTENT_DIR, relPath);
  const raw = readFileSafe(fullPath);
  if (!raw) return {};
  return yaml.load(raw) || {};
}

export function getSiteConfig() {
  const site = readYaml('site.yaml');
  return {
    site_title: site.site_title || 'Himount Gardens',
    phone_number: site.phone_number || '(414) 445-9772',
    address: site.address || {
      street: '2325 N. 50th Street',
      city: 'Milwaukee',
      state: 'WI',
      zip: '53210'
    },
    marketing_knobs: site.marketing_knobs || {
      hero_cta: 'Check Availability',
      secondary_cta: 'Schedule Tour'
    },
    colors: site.colors || { primary: '#1f3a5f', secondary: '#d9c7a4' },
    nav: site.nav || [],
    footer: site.footer || {}
  };
}

function getUnitPhotos(folderName) {
  if (!folderName) return [];
  const dir = path.join(IMAGES_DIR, folderName);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|gif|webp|svg)$/i.test(f)).sort();
  return files.map(f => ({
    src: '/images/units/' + folderName + '/' + f,
    alt_text: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
  }));
}

export function getUnits() {
  const data = readYaml('units.yaml');
  const units = data?.units || [];
  return units.map(unit => ({
    ...unit,
    photos: unit.photos_folder ? getUnitPhotos(unit.photos_folder) : (unit.photos || [])
  }));
}

export function getGallery() {
  const data = readYaml('gallery.yaml');
  return data?.images || [];
}

export function getPage(slug) {
  const pagePath = path.join(CONTENT_DIR, 'pages', `${slug}.md`);
  const raw = readFileSafe(pagePath);

  if (!raw) {
    return {
      slug,
      title: slug,
      seo_description: '',
      hero_image: '',
      body: '',
      html: ''
    };
  }

  const parsed = matter(raw);
  const body = parsed.content?.trim() || '';

  return {
    slug,
    title: parsed.data?.title || slug,
    seo_description: parsed.data?.seo_description || '',
    hero_image: parsed.data?.hero_image || '',
    body,
    html: marked.parse(body)
  };
}
