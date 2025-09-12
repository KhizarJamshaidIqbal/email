/**
 * local server entry file, for local development
 * Updated to trigger restart
 */

// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';

// Get the correct path for .env file (project root)
const envPath = path.join(process.cwd(), '.env');

dotenv.config({ path: envPath });

import app from './app.js';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;