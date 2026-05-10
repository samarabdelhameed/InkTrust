import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import apiRoutes from './api/routes';
import { logger } from './lib/logger';
import { env } from './lib/env';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

export default app;
