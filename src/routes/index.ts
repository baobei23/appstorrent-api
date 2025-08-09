import { Router, IRouter } from 'express';
import { latestPrograms, programDetails } from '@/controller/programs';


const router: IRouter = Router();

router.get('/programs', latestPrograms);
router.get('/program/:id', programDetails);

export default router;