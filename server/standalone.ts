/**
 * KKM Corporate Intelligence Agent v3.0
 * Standalone Express Server Entry Point (for Production / Container deployment)
 */

import express from 'express';
import path from 'path';
import { handleApiRequest } from './apiRouter';

const app = express();
const PORT = process.env.PORT || 3000;

// Mount API router
app.use(async (req, res, next) => {
  if (req.url.startsWith('/api/agent/')) {
    const handled = await handleApiRequest(req, res);
    if (handled) return;
  }
  next();
});

// Serve static build assets if available
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[KKM Corporate Intelligence] Standalone server running on port ${PORT}`);
});
