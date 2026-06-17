// `import type` keeps this purely at the type level (no JSON pulled into any
// bundle). The Italian file is the source of truth for the dictionary shape;
// en.json must match it.
import type it from '@/app/[lang]/dictionaries/it.json';

export type Dictionary = typeof it;
