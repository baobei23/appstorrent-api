import * as cheerio from "cheerio";
import { AxiosResponse } from "axios";
import { Request } from "express";
import { ISetOfCategory } from "@/types";
import programCategory from "@/json/programCategory.json";
import gameCategory from "@/json/gameCategory.json";

/**
 * Scrape a set of category asynchronously
 * @param {Request} ExpressRequest
 * @param {AxiosResponse} AxiosResponse
 * @returns {Promise.<ISetOfCategory[]>} a set of category
 */
export const scrapeSetOfProgramsCategory = async (
  req: Request,
  res: AxiosResponse
): Promise<ISetOfCategory[]> => {
  const $: cheerio.Root = cheerio.load(res.data);
  const payload: ISetOfCategory[] = [];
  const {
    headers: { host },
    protocol,
  } = req;

  $("div.dropdown-menu-category#gameDropdown > a").each((_, el) => {
    const href: string = $(el).attr("href") || "";
    const name: string = $(el).text().replace(/\s+/g, " ").trim();

    const trimmed = href.replace(/\/$/, "");
    const slug = trimmed.split("/").pop() || "";

    const obj: ISetOfCategory = {
      parameter:
        programCategory.find(
          (category) => category.toLowerCase() === slug.toLowerCase()
        ) || slug,
      name,
      url: `${protocol}://${host}/programs-category/${slug}`,
    };

    payload.push(obj);
  });

  return payload;
};

/**
 * Scrape a set of category asynchronously
 * @param {Request} ExpressRequest
 * @param {AxiosResponse} AxiosResponse
 * @returns {Promise.<ISetOfCategory[]>} a set of category
 */

export const scrapeSetOfGamesCategory = async (
  req: Request,
  res: AxiosResponse
): Promise<ISetOfCategory[]> => {
  const $: cheerio.Root = cheerio.load(res.data);
  const payload: ISetOfCategory[] = [];
  const {
    headers: { host },
    protocol,
  } = req;

  $("div.dropdown-menu-category#progDropdown > a").each((_, el) => {
    const href: string = $(el).attr("href") || "";
    const name: string = $(el).text().replace(/\s+/g, " ").trim();

    const trimmed = href.replace(/\/$/, "");
    const slug = trimmed.split("/").pop() || "";

    const obj: ISetOfCategory = {
      parameter:
        gameCategory.find(
          (category) => category.toLowerCase() === slug.toLowerCase()
        ) || slug,
      name,
      url: `${protocol}://${host}/games-category/${slug}`,
    };

    payload.push(obj);
  });

  return payload;
};
