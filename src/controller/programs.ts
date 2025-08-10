import axios from "axios";
import { NextFunction as Next, Request, Response } from "express";
import { scrapeProgramDetails, scrapePrograms } from "@/scrapers/programs";

type TController = (req: Request, res: Response, next?: Next) => Promise<void>;

/**
 * Controller for `/programs` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const latestPrograms: TController = async (req, res) => {
  try {
    const { page = 0 } = req.query;

    const axiosRequest = await axios.get(
      `${process.env.URL}/programs${Number(page) > 1 ? `/?page=${page}` : ""}`
    );

    const payload = await scrapePrograms(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};

/**
 * Controller for `/program/{programId}` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const programDetails: TController = async (req, res) => {
  try {
    const { id } = req.params;

    const axiosRequest = await axios.get(`${process.env.URL}/program/${id}`);

    const payload = await scrapeProgramDetails(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};
