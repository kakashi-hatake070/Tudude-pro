import express from 'express';
import { getCurrentWeatherAndHazards } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/current', getCurrentWeatherAndHazards);

export default router;
