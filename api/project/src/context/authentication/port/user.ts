import express, { NextFunction, Request, Response } from 'express';
import { DuplicationError } from '../../../error/duplication-error';
import { ValidationError } from '../../share/value-object/value-object';
import { UserApplicationService } from '../application/user-application-service';
import { TOUserRepository } from '../infrastructure/typeorm/to-user-repository';

export const router = express.Router();

let userApplicationService: UserApplicationService;
router.use((_req: Request, _res: Response, next: NextFunction) => {
  userApplicationService = new UserApplicationService(new TOUserRepository());
  next();
});

router.post('/', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  try {
    await userApplicationService.register(email, password);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.boom.badRequest(err.message);
    } else if (err instanceof DuplicationError) {
      return res.boom.conflict(err.message);
    }
    return res.boom.badGateway(err);
  }

  return res.status(201).send();
});

router.post(
  '/authentication',
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    let token = await userApplicationService.authenticate(email, password);

    return res.send({ token });
  }
);
