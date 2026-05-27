import express from 'express';
import NoteModel from './models/NoteModel.js';s

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;