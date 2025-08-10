import axios from "axios";
import { NextFunction as Next, Request, Response } from "express";
import { scrapeSetOfCategory } from "@/scrapers/programsCategory";
import { scrapePrograms } from "@/scrapers/programs";

type TController = (req: Request, res: Response, next?: Next) => Promise<void>;

/**
 * Controller for `/genres` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const setOfProgramsCategory: TController = async (req, res) => {
  try {
    const axiosRequest = await axios.get(`${process.env.URL}`);

    const payload = await scrapeSetOfCategory(req, axiosRequest);

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
