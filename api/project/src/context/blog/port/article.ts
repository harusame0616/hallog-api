import express from 'express';
import { AuthUser } from '../../../@types/express';
import { AuthenticationHelper } from '../../../helper/authentication-helper';
import { ArticleApplicationService } from '../application/article-application-service';
import { ArticleQueryService } from '../application/article-query-service';
import { ArticleRepository } from '../domain/article/article-repository';
import { BlogRepository } from '../domain/blog/blog-repository';
import { BloggerRepository } from '../domain/blogger/blogger-repository';
import { TOArticleQueryService } from '../repositories/typeorm/to-article-query-service';
import { TOArticleRepository } from '../repositories/typeorm/to-article-repository';
import { TOBlogRepository } from '../repositories/typeorm/to-blog-repository';
import { TOBloggerRepository } from '../repositories/typeorm/to-blogger-repository';

export const router = express.Router();

let articleApplicationService: ArticleApplicationService;
let blogRepository: BlogRepository;
let bloggerRepository: BloggerRepository;
let articleRepository: ArticleRepository;
let articleQueryService: ArticleQueryService;

router.use(
  (
    req: express.Request,
    res: express.Response,
    nextFunction: express.NextFunction
  ) => {
    bloggerRepository = new TOBloggerRepository();
    blogRepository = new TOBlogRepository();
    articleRepository = new TOArticleRepository();
    articleQueryService = new TOArticleQueryService();
    articleApplicationService = new ArticleApplicationService(
      blogRepository,
      bloggerRepository,
      articleRepository,
      articleQueryService
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

router.get('/new', async (req: express.Request, res: express.Response) => {
  const { blogId, size, index } = req.query;

  let articles;
  try {
    articles = await articleApplicationService.getNewArticles(
      blogId as string,
      parseInt(size as string) || 5,
      parseInt(index as string) || 0
    );
  } catch (err) {
    return res.boom.badGateway(err);
  }

  return res.status(200).send(articles);
});

router.get(
  '/:articleId',
  async (req: express.Request, res: express.Response) => {
    const { articleId } = req.params;

    let article;
    try {
      article = await articleApplicationService.read(articleId);
    } catch (err) {
      return res.boom.badGateway(err);
    }

    return res.status(200).send(article);
  }
);
