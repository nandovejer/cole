import { DEFAULT_LANG } from './ui.js';

export type Lang = 'es' | 'en';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Builds a site URL in that language. `p` starts with '/'. */
export function href(lang: Lang, p = '/') {
  return base + (lang === DEFAULT_LANG ? '' : `/${lang}`) + p;
}

/** The same page in the other language. */
export function swapLang(pathname: string, to: Lang) {
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  p = p.replace(/^\/en(?=\/|$)/, '') || '/';
  return href(to, p);
}
