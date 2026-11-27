import express from 'express';
import { registerCitizen, loginCitizen, getMe, updateSavedPlaces } from '../controllers/authController.js';
import { protectCitizen } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerCitizen);
router.post('/login', loginCitizen);
router.get('/me', protectCitizen, getMe);
router.post('/saved-places', protectCitizen, updateSavedPlaces);

export default router;
