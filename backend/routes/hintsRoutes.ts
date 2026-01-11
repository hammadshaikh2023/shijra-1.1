import { Router } from 'express';
import { getAncestryHints } from '../controllers/hintsController';

const router = Router();

/**
 * @route GET /api/hints/:individualId
 * @desc Get smart ancestor matches
 * @access Public (Protected logic inside controller)
 */
router.get('/:individualId', getAncestryHints);

export default router;
