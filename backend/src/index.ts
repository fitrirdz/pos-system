import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'OK' });
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
