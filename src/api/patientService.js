import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { successResponse } from "./baseResponse";
import { delay } from "../utils/delay";

const getPatients = () => storageService.getCollection(STORAGE_KEYS.PATIENTS);

const savePatients = (patients) =>
  storageService.saveCollection(STORAGE_KEYS.PATIENTS, patients);

const patientService = {
  async getPatientByUserId(userId) {
    await delay(300);

    const patients = getPatients();

    const patient = patients.find((p) => p.user === userId);

    if (!patient) {
      throw new Error("Patient profile not found");
    }

    return successResponse({
      patient,
    });
  },

  async updatePatient(userId, updatedData) {
    await delay(400);

    const patients = getPatients();

    const index = patients.findIndex((p) => p.user === userId);

    if (index === -1) {
      throw new Error("Patient profile not found");
    }

    patients[index] = {
      ...patients[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    savePatients(patients);

    return successResponse({
      patient: patients[index],
    });
  },

  async getPatientById(patientId) {
    await delay(250);

    const patients = getPatients();

    const patient = patients.find((p) => p._id === patientId);

    if (!patient) {
      throw new Error("Patient profile not found");
    }

    return successResponse({
      patient,
    });
  },
};

export default patientService;
