import * as cheerio from 'cheerio';

export interface ParsedData {
  title: string;
  headers: Record<string, string>;
  forms: number;
  scripts: number;
  links: number;
  inputs: number;
  iframes: number;
  externalScripts: number;
  inlineScripts: number;
}

export function parseHtml(html: string, headers: Record<string, string>): ParsedData {
  const $ = cheerio.load(html);
  
  return {
    title: $('title').text(),
    headers,
    forms: $('form').length,
    scripts: $('script').length,
    links: $('a').length,
    inputs: $('input').length,
    iframes: $('iframe').length,
    externalScripts: $('script[src]').length,
    inlineScripts: $('script:not([src])').length
  };
}