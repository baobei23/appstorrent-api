import axios from "axios";
import { NextFunction as Next, Request, Response } from "express";
import {
  scrapeSetOfGamesCategory,
  scrapeSetOfProgramsCategory,
} from "@/scrapers/category";
import { scrapePrograms } from "@/scrapers/programs";
import { scrapeGames } from "@/scrapers/games";

type TController = (req: Request, res: Response, next?: Next) => Promise<void>;

/**
 * Controller for `/programs-category` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const setOfProgramsCategory: TController = async (req, res) => {
  try {
    const axiosRequest = await axios.get(`${process.env.URL}`);

    const payload = await scrapeSetOfProgramsCategory(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};

/**
 * Controller for `/games-category` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const setOfGamesCategory: TController = async (req, res) => {
  try {
    const axiosRequest = await axios.get(`${process.env.URL}`);

    const payload = await scrapeSetOfGamesCategory(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};

/**
 * Controller for `/programs-category/:category` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const programsByCategory: TController = async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const { category } = req.params;

    const axiosRequest = await axios.get(
      `${process.env.URL}/programs-category/${category}${
        Number(page) > 1 ? `/?page=${page}` : ""
      }`
    );

    const payload = await scrapePrograms(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};
/**
 * Controller for `/games-category/:category` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const gamesByCategory: TController = async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const { category } = req.params;

    const axiosRequest = await axios.get(
      `${process.env.URL}/games-category/${category}${
        Number(page) > 1 ? `/?page=${page}` : ""
      }`
    );

    const payload = await scrapeGames(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};
