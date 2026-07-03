import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', apiLimiter);
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', routes);

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err instanceof Error ? err.stack : err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    // Never expose stack traces in production, but helpful in dev
    error: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
