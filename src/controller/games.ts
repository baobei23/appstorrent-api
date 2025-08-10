import axios from "axios";
import { NextFunction as Next, Request, Response } from "express";
import { scrapeGames, scrapeGameDetails } from "@/scrapers/games";

type TController = (req: Request, res: Response, next?: Next) => Promise<void>;

/**
 * Controller for `/games` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const latestGames: TController = async (req, res) => {
  try {
    const { page = 0 } = req.query;

    const axiosRequest = await axios.get(
      `${process.env.URL}/games${Number(page) > 1 ? `/?page=${page}` : ""}`
    );

    const payload = await scrapeGames(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};

/**
 * Controller for `/game/{gameId}` route
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
export const gameDetails: TController = async (req, res) => {
  try {
    const { id } = req.params;

    const axiosRequest = await axios.get(`${process.env.URL}/game/${id}`);

    const payload = await scrapeGameDetails(req, axiosRequest);

    res.status(200).json(payload);
  } catch (err) {
    console.error(err);

    res.status(400).json(null);
  }
};
