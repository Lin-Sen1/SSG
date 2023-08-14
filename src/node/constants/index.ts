import { join } from 'path';

export const PACKAGE_ROOT = join(__dirname, '..');

export const DEFAULT_HTML_PATH = join(PACKAGE_ROOT, 'template.html');

export const CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'client-entry.tsx'
);

export const SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  'src',
  'runtime',
  'ssr-entry.tsx'
);

export const MD_REGEX = /\.mdx?/;

export const MASK_SPLITTER = '!!ISLAND!!';

export const CLIENT_OUTPUT = 'build';
