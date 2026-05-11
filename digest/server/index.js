import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { startScheduler } from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  startScheduler();
});
