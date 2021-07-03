import express from 'express';
import { AuthUser } from '../../../@types/express';
import { AuthenticationHelper } from '../../../helper/authentication-helper';
import { ArticleApplicationService } from '../application/article-application-service';
import { ArticleRepository } from '../domain/article/article-repository';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { TOArticleRepository } from '../repositories/typeorm/to-article-repository';
import { TOBlogRepository } from '../repositories/typeorm/to-blog-repository';
import { TOBloggerRepository } from '../repositories/typeorm/to-blogger-repository';

export const router = express.Router();

let articleApplicationService: ArticleApplicationService;
let blogRepository: BlogRepository;
let bloggerRepository: BloggerRepository;
let articleRepository: ArticleRepository;

router.use(
  (
    req: express.Request,
    res: express.Response,
    nextFunction: express.NextFunction
  ) => {
    bloggerRepository = new TOBloggerRepository();
    blogRepository = new TOBlogRepository();
    articleRepository = new TOArticleRepository();
    articleApplicationService = new ArticleApplicationService(
      blogRepository,
      bloggerRepository,
      articleRepository
    );

    nextFunction();
  }
);

router.post(
  '/',
  AuthenticationHelper.requireAuthentication,
  async (req: express.Request, res: express.Response) => {
    const { id: posterId } = req.user as AuthUser;
    const { blogId, title, content, tags, isPublic } = req.body;

    try {
      await articleApplicationService.post(
        posterId,
        blogId,
        title,
        content,
        tags,
        isPublic
      );
    } catch (err) {
      return res.boom.badGateway(err);
    }
    return res.status(201).send();
  }
);
