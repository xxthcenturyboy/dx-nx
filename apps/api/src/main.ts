import express from 'express';
import { RoutesV1 } from './routes/v1.routes';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const v1Routes = new RoutesV1(app);
v1Routes.loadRoutes();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
