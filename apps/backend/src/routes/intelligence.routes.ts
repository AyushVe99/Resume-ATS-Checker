import { Router } from 'express';
import { IntelligenceController } from '../controllers/intelligence.controller';

const router = Router();
const intelligenceController = new IntelligenceController();

router.post('/identity', intelligenceController.generateIdentity);
router.post('/readiness', intelligenceController.generateReadiness);
router.get('/evidence/:nodeId', intelligenceController.getEvidence);

export default router;
