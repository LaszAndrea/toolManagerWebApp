import express from 'express';
import cors from 'cors';
import graphRoutes from './routes/graph.route';

const app = express();
const port = 3300;

app.use(cors());
app.use(express.json());
app.use('/', graphRoutes);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
