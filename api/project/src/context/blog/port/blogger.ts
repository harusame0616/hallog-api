import ValidationError from 'ajv/dist/runtime/validation_error';
import express from 'express';
import { AuthUser } from '../../../@types/express';
import { DuplicationError } from '../../../error/duplication-error';
import { NotFoundError } from '../../../error/not-found-error';
import { AuthenticationHelper } from '../../../helper/authentication-helper';
import { BloggerApplicationService } from '../application/blogger-application-service';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { TOBloggerRepository } from '../repositories/typeorm/to-blogger-repository';

export const router = express.Router();

let bloggerApplicationService: BloggerApplicationService;
let bloggerRepository: BloggerRepository;


router.use(
  (
    _req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    bloggerRepository = new TOBloggerRepository();
    bloggerApplicationService = new BloggerApplicationService(
      bloggerRepository
    );
    next();
  }
);

router.post(
  '/',
  AuthenticationHelper.requireAuthentication,
  async (req: express.Request, res: express.Response) => {
    const { id } = req.user as AuthUser;
    const { nickname, prComment } = req.body;

    try {
      await bloggerApplicationService.register(id, nickname, prComment);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.boom.badRequest(err.message);
      } else if (err instanceof DuplicationError) {
        return res.boom.conflict(err.message);
      }

      return res.boom.badGateway(err.message || err);
    }

    return res.status(201).send();
  }
);

/**
 *
 */
router.get(
  '/:bloggerId',
  async (req: express.Request, res: express.Response) => {
    const { bloggerId } = req.params;

    try {
      return res.send(await bloggerApplicationService.getProfile(bloggerId));
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.boom.badRequest(err.message);
      }

      return res.boom.badGateway(err.message || err);
    }
  }
);

/**
 *
 */
router.put(
  '/:bloggerId',
  async (req: express.Request, res: express.Response) => {
    const { bloggerId } = req.params;
    const { nickname, prComment } = req.body;

    try {
      await bloggerApplicationService.update(bloggerId, {
        nickname,
        prComment,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.boom.notFound(err.message);
      }
      if (err instanceof ValidationError) {
        return res.boom.badRequest(err.message);
      }

      return res.boom.badGateway(err.message || err);
    }

    return res.status(200).send();
  }
);
