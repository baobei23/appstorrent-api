import { Router, IRouter } from 'express';
import { latestPrograms, programDetails } from '@/controller/programs';
import { latestGames, gameDetails } from '@/controller/games';


const router: IRouter = Router();

router.get('/programs', latestPrograms);
router.get('/program/:id', programDetails);

router.get('/games', latestGames);
router.get('/game/:id', gameDetails)

export default router;