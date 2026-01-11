import { Router } from 'express';
import { createIndividual, getIndividual, updateIndividual } from '../controllers/individualController';

const router = Router();

// 1. Add New Individual
router.post('/individual', createIndividual);

// 2. Get Individual Details (with Media & Stories)
router.get('/individual/:id', getIndividual);

// 3. Update Individual
router.put('/individual/:id', updateIndividual);

export default router;
