import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sportz server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
