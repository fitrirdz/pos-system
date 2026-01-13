import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route';

const app = express();
app.use(cors());
app.use(express.json());

// Auth Route
app.use('/auth', authRouter);

app.listen(4000, () => {
  console.log('🚀 Backend running on http://localhost:4000');
});
