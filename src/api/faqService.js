import faqsSeed from "../data/seed/faqs";
import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { delay } from "../utils/delay";
import { successResponse, errorResponse } from "./baseResponse";

class FAQService {
  initialize() {
    if (!storageService.exists(STORAGE_KEYS.FAQS)) {
      storageService.saveCollection(STORAGE_KEYS.FAQS, faqsSeed);
    }
  }

  async getAll() {
    await delay();

    this.initialize();

    const faqs = storageService.getCollection(STORAGE_KEYS.FAQS);

    return successResponse({
      data: faqs,
    });
  }

  async getById(id) {
    await delay();

    this.initialize();

    const faq = storageService
      .getCollection(STORAGE_KEYS.FAQS)
      .find((item) => item._id === id);

    if (!faq) {
      return errorResponse("FAQ not found", 404);
    }

    return successResponse({
      data: faq,
    });
  }
}

export default new FAQService();
