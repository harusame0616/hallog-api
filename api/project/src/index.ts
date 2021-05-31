import express from 'express';
import { createConnection, getRepository } from 'typeorm';
import { User } from './db/entities/user';
const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  }
);

app.listen(3000, () => {
  console.log('Start on port 3000.');
});
createConnection();

app.get('/', async (req: express.Request, res: express.Response) => {
  const user = new User('test', 'test', 'test', 5);
  const repository = getRepository(User);
  await repository.save(user);

  res.send('OK');
});
