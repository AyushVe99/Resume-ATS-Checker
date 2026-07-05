import { Router } from 'express';
import { AtsController } from '../controllers/ats.controller';
import { upload } from '../middleware/upload.middleware';
import intelligenceRoutes from './intelligence.routes';

const router = Router();
const atsController = new AtsController();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.post('/upload', upload.single('resume'), atsController.uploadResume);
router.post('/analyze', atsController.analyzeResume);

router.use('/intelligence', intelligenceRoutes);

export default router;
