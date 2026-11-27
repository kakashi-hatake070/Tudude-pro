import express from 'express';
import { getAreaIntelligence } from '../controllers/exploreController.js';

const router = express.Router();

router.get('/area', getAreaIntelligence);

export default router;
