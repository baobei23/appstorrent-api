import { Router, IRouter } from "express";
import { latestPrograms, programDetails } from "@/controller/programs";
import { latestGames, gameDetails } from "@/controller/games";
import { setOfProgramsCategory } from "@/controller/programsCategory";
import { programsByCategory } from "@/controller/programsCategory";

const router: IRouter = Router();

router.get("/programs", latestPrograms);
router.get("/program/:id", programDetails);

router.get("/games", latestGames);
router.get("/game/:id", gameDetails);

router.get("/programs-category", setOfProgramsCategory);
router.get("/programs-category/:category", programsByCategory);

export default router;
