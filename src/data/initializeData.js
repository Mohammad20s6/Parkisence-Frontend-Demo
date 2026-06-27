import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";

import adviceSeed from "./seed/advice";
import usersSeed from "./seed/users";
import patientsSeed from "./seed/patients";
import testResultsSeed from "./seed/testResults";

export const initializeData = () => {
  if (!storageService.exists(STORAGE_KEYS.USERS)) {
    storageService.saveCollection(STORAGE_KEYS.USERS, usersSeed);
  }

  if (!storageService.exists(STORAGE_KEYS.PATIENTS)) {
    storageService.saveCollection(STORAGE_KEYS.PATIENTS, patientsSeed);
  }

  if (!storageService.exists(STORAGE_KEYS.TEST_RESULTS)) {
    storageService.saveCollection(STORAGE_KEYS.TEST_RESULTS, testResultsSeed);
  }

  if (!storageService.exists(STORAGE_KEYS.ADVICE)) {
    storageService.saveCollection(STORAGE_KEYS.ADVICE, adviceSeed);
  }
};
