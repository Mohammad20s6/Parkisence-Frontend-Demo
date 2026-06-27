import articlesSeed from "../data/seed/articles";
import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { delay } from "../utils/delay";
import { successResponse, errorResponse } from "./baseResponse";

class ArticleService {
  initialize() {
    if (!storageService.exists(STORAGE_KEYS.ARTICLES)) {
      storageService.saveCollection(STORAGE_KEYS.ARTICLES, articlesSeed);
    }
  }

  async getAll() {
    await delay();

    this.initialize();

    const articles = storageService.getCollection(STORAGE_KEYS.ARTICLES);

    return successResponse({
      data: articles,
    });
  }

  async getById(id) {
    await delay();

    this.initialize();

    const article = storageService
      .getCollection(STORAGE_KEYS.ARTICLES)
      .find((item) => item._id === id);

    if (!article) {
      return errorResponse("Article not found", 404);
    }

    return successResponse({
      data: article,
    });
  }
}

export default new ArticleService();
