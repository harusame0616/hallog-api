import express from 'express';
import { AuthUser } from '../../../@types/express';
import { OverflowError } from '../../../error/overflow-error';
import { ValidationError } from '../../../error/validation-error';
import { AuthenticationHelper } from '../../../helper/authentication-helper';
import { BlogApplicationService } from '../application/blog-application-service';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { TOBlogRepository } from '../repositories/typeorm/to-blog-repository';
import { TOBloggerRepository } from '../repositories/typeorm/to-blogger-repository';

export const router = express.Router();

let blogApplicationService: BlogApplicationService;
let blogRepository: BlogRepository;
let bloggerRepository: BloggerRepository;

router.use(
  (
    _req: express.Request,
    _res: express.Response,
    nextFunction: express.NextFunction
  ) => {
    bloggerRepository = new TOBloggerRepository();
    blogRepository = new TOBlogRepository();
    blogApplicationService = new BlogApplicationService(
      blogRepository,
      bloggerRepository
    );

    nextFunction();
  }
);

router.post(
  '/',
  AuthenticationHelper.requireAuthentication,
  async (req: express.Request, res: express.Response) => {
    const { id: bloggerId } = req.user as AuthUser;
    const { id, title, description } = req.body;

    try {
      await blogApplicationService.create(id, title, description, bloggerId);
    } catch (err) {
      if (err instanceof ValidationError || err instanceof OverflowError) {
        return res.boom.badRequest(err.message);
      }
      if (err instanceof OverflowError) {
      }

      return res.boom.badGateway(err.message);
    }
    res.send();
  }
);
