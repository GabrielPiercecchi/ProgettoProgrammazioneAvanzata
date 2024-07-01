import express from 'express';
import { sequelize } from './models';
import router from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Server is running at http://localhost:${port}`);
});

