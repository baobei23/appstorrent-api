import * as cheerio from "cheerio";
import { AxiosResponse } from "axios";
import { Request } from "express";
import { ISetOfProgramsCategory } from "@/types";
import programCategory from "@/json/programCategory.json";

/**
 * Scrape a set of genres asynchronously
 * @param {Request} ExpressRequest
 * @param {AxiosResponse} AxiosResponse
 * @returns {Promise.<ISetOfProgramsCategory[]>} a set of genres
 */
export const scrapeSetOfCategory = async (
  req: Request,
  res: AxiosResponse
): Promise<ISetOfProgramsCategory[]> => {
  const $: cheerio.Root = cheerio.load(res.data);
  const payload: ISetOfProgramsCategory[] = [];
  const {
    headers: { host },
    protocol,
  } = req;

  $("div.dropdown-menu-category#gameDropdown > a").each((_, el) => {
    const href: string = $(el).attr("href") || "";
    const name: string = $(el).text().replace(/\s+/g, " ").trim();

    const trimmed = href.replace(/\/$/, "");
    const slug = trimmed.split("/").pop() || "";

    const obj: ISetOfProgramsCategory = {
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
