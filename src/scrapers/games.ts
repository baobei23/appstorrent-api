import { Request } from 'express';
import * as cheerio from 'cheerio';
import { AxiosResponse } from 'axios';
import { Games, GameDetails, Paragraph, DownloadLink } from '@/types';

/**
 * Scrape games (software list) asynchronously
 * @param {Request} req Express Request (used for building absolute URLs)
 * @param {AxiosResponse} res Axios Response containing HTML
 * @returns {Promise<Games[]>} array of software objects
 */
export const scrapeGames = async (
  req: Request,
  res: AxiosResponse
): Promise<Games[]> => {
  const $: cheerio.Root = cheerio.load(res.data);
  const payload: Games[] = [];

  const {
    protocol,
    headers: { host },
  } = req;

  $('article.games-item').each((i, el) => {
    const node: cheerio.Cheerio = $(el);

    const link: string = node.find('div.text > a').attr('href') ?? '';
    const trimmedLink: string = link.replace(/\/+$/, '');
    const idFromLink: string = trimmedLink.split('/').pop() ?? '';

    const rawImgSrc: string = node.find('a.link-title > img').attr('src') ?? '';

    const categoriesText: string = node.find('span.caption-1').text().trim();
    const categories: string[] = categoriesText
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const obj: Games = {
      _id: idFromLink,
      title: node.find('h2.body-2').text().trim(),
      img: `${process.env.URL ?? ''}${rawImgSrc}`,
      category: categories.length > 0 ? categories : [categoriesText],
      url: `${protocol}://${host}/game/${idFromLink}`,
      size: node.find('div.size > div.marker').text().trim(),
    };

    payload.push(obj);
  });

  return payload;
};

/**
 * Scrape software details asynchronously
 * @param {Request} req Express Request
 * @param {AxiosResponse} res Axios Response containing HTML
 * @returns {Promise<GameDetails>} software details object
 */
export const scrapeGameDetails = async (
  req: Request,
  res: AxiosResponse
): Promise<GameDetails> => {
  const $: cheerio.Root = cheerio.load(res.data);


  const originalUrl: string = (req.originalUrl || '').replace(/\/+$/, '');
  const idFromUrl: string = originalUrl.split('/').pop() || '';

  const title: string = $('div.title.page.main-title h1').first().text().trim();
  const version: string = $('span[itemprop="softwareVersion"]').first().text().trim();
  const developer: string = $('span[itemprop="author"]').first().text().trim();

  const iconSrc: string = $('div.title.page .icon img').first().attr('src') || '';
  const img: string = `${process.env.URL ?? ''}${iconSrc}`;

  const category: string[] = [];
  $('div.title.page .tags_plugin a').each((_, el) => {
    const text: string = $(el).text().trim();
    if (text.length > 0) category.push(text);
  });

  // Size from download button text: "Download for Free (51 MB)"
  const downloadBtnText: string = $('div.btn-block button.big.green').first().text().trim();
  const sizeMatch: RegExpMatchArray | null = downloadBtnText.match(/\(([^)]+)\)/);
  const size: string = sizeMatch ? sizeMatch[1].trim() : '';

  // Posters from screenshots slider
  const posters: string[] = [];
  $('div.screenshots .swiper-slide img').each((_, el) => {
    const src = $(el).attr('src') || '';
    const prefixed = `${process.env.URL ?? ''}${src}`;
    if (prefixed) posters.push(prefixed);
  });

  // Info blocks (interface language, activation, compatibility, architecture, note)
  let releaseDate = '';
  let interfaceLanguage = '';
  let activation = '';
  let tested = ''
  let architecture = '';

  $('div.info .info-block').each((_, el) => {
    const label: string = $(el).find('span.body-2.gray').first().text().trim().toLowerCase();
    if (!label) return;

    const valueText: string = $(el)
      .find('span.body-2')
      .not('.gray')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    switch (label) {
      case 'release date':
        if (!releaseDate) releaseDate = valueText;
        break;
      case 'interface language':
        if (!interfaceLanguage) interfaceLanguage = valueText;
        break;
      case 'activation (rg)':
        if (!activation) activation = valueText;
        break;
      case 'tested':
        if (!tested) tested = valueText;
        break;
      case 'architecture':
        if (!architecture) architecture = valueText;
        break;
      default:
        break;
    }
  });

  // Official site link
  const officialSite: string = ($('a.off-link').first().attr('href') || '');

  // Downloads (group button)
  const downloads: DownloadLink[] = [];
  $('#GroupButton .list_link a').each((_, el) => {
    const type: string = $(el).text().replace(/\s+/g, ' ').trim();
    const link: string = $(el).attr('href') || '';
    if (link) {
      downloads.push({ type, link });
    }
  });

  // Previous versions
  const previousVersion: DownloadLink[] = [];
  $('#OlderVersions .older-vers a').each((_, el) => {
    const type: string = $(el).text().replace(/\s+/g, ' ').trim();
    const link: string = $(el).attr('href') || '';
    if (link) {
      previousVersion.push({ type, link });
    }
  });

  const description: string[] = [];

  $('#tabs-1 .body-content h3, #tabs-1 .body-content p, #tabs-1 .body-content li').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) {
      description.push(text);
    }
  });
  
  const requirements: string[] = [];
  $('#tabs-3 .body-content > p').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) requirements.push(text);
  });
  
  $('#tabs-3 .body-content ul li').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) requirements.push(text);
  });
  

  // FAQ
  const faq: Paragraph[] = [];
  $('.faq-block .quote-body .title_spoiler').each((_, el) => {
    const titleText: string = $(el).find('span.body-2').first().text().replace(/\s+/g, ' ').trim();
    const contentText: string = $(el)
      .nextAll('div.text_spoiler')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();
    if (titleText || contentText) {
      faq.push({ title: titleText, content: contentText });
    }
  });

  const details: GameDetails = {
    _id: idFromUrl,
    title,
    version,
    img,
    category,
    size,
    posters,
    developer,
    interface_language: interfaceLanguage,
    activation,
    releaseDate,
    architecture,
    tested,
    downloads,
    previous_version: previousVersion,
    description,
    requirements,
    officialSite: officialSite,
    faq,
  };

  return details;
};
