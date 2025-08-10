import { Router, IRouter } from "express";
import { latestPrograms, programDetails } from "@/controller/programs";
import { latestGames, gameDetails } from "@/controller/games";
import {
  setOfProgramsCategory,
  programsByCategory,
  setOfGamesCategory,
  gamesByCategory,
} from "@/controller/category";

const router: IRouter = Router();

router.get("/programs", latestPrograms);
router.get("/program/:id", programDetails);

router.get("/games", latestGames);
router.get("/game/:id", gameDetails);

router.get("/programs-category", setOfProgramsCategory);
router.get("/programs-category/:category", programsByCategory);
router.get("/games-category", setOfGamesCategory);
router.get("/games-category/:category", gamesByCategory);

export default router;
