import express from 'express';
import { planSafeRoutes } from '../services/routingService.js';

const router = express.Router();

router.post('/safe-route', async (req, res) => {
  try {
    const { origin, destination, travelMode, riskPreference } = req.body;

    if (!origin || !destination || origin.length !== 2 || destination.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Valid origin and destination coordinates [longitude, latitude] are required.'
      });
    }

    const routePlan = await planSafeRoutes(origin, destination, travelMode, riskPreference);
    res.json(routePlan);
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
