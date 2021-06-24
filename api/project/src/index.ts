import express from 'express';
import boom from 'express-boom';
import expressJWT from 'express-jwt';
import { router as authenticationUserRouter } from './context/authentication/port/user';
import { router as blogBloggerRouter } from './context/blog/port/blogger';
import { TORepository } from './context/share/repository/typeorm/to-repository';
import { CustomError } from './error/custom-error';
class EnvironmentVariableUndefinedError extends CustomError {}


const app: express.Express = express();
const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const main = async () =>  {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(boom());
  app.use(
    expressJWT({
      secret: process.env.AUTH_SECRET || 'DEVELOPMENT_SECRET',
      algorithms: [process.env.AUTH_ALGORITHM || 'HS256'],
      credentialsRequired: false,
    })
  );

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    }
  );


  app.use('/authentications/users', authenticationUserRouter);
  app.use('/blog/bloggers', blogBloggerRouter);

  for (let retryCount = 0; retryCount < 5; retryCount++)   {
    try {
      await TORepository.connect();
    } catch (err)   {
      console.log('DB connection failed.', err);
      const retryWait = 3000;
      await sleep(retryWait);

      continue;
    }

    console.log('DB connected.');
    app.listen(3000, () => {
      console.log('Start on port 3000.');
    });
    break;
  }
};



main();
