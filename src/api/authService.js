import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { successResponse, errorResponse } from "./baseResponse";
import { generateId } from "../utils/generateId";
import { delay } from "../utils/delay";

const getUsers = () => storageService.getCollection(STORAGE_KEYS.USERS);

const saveUsers = (users) =>
  storageService.saveCollection(STORAGE_KEYS.USERS, users);

const getPatients = () => storageService.getCollection(STORAGE_KEYS.PATIENTS);

const savePatients = (patients) =>
  storageService.saveCollection(STORAGE_KEYS.PATIENTS, patients);

const removePassword = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};

const authService = {
  async login(email, password) {
    await delay(600);

    const users = getUsers();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("token", user._id);

    return successResponse({
      token: user._id,
    });
  },

  async register(name, email, password) {
    await delay(700);

    const users = getUsers();

    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (exists) {
      throw new Error("Email already exists. Please use another one.");
    }

    const now = new Date().toISOString();

    const newUser = {
      _id: generateId(),

      name,

      email,

      password,

      role: "patient",

      passwordChangedAt: null,

      createdAt: now,

      updatedAt: now,
    };

    users.push(newUser);

    saveUsers(users);

    const patients = getPatients();

    patients.push({
      _id: generateId(),

      user: newUser._id,

      birthDate: null,

      phone: "",

      gender: "none",

      createdAt: now,

      updatedAt: now,
    });

    savePatients(patients);

    localStorage.setItem("token", newUser._id);

    return successResponse({
      token: newUser._id,
    });
  },

  async getCurrentUser() {
    await delay(300);

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized");
    }

    const users = getUsers();

    const user = users.find((u) => u._id === token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    return successResponse({
      data: removePassword(user),
    });
  },

  async updateUser(userId, updatedData) {
    await delay(400);

    const users = getUsers();

    const index = users.findIndex((u) => u._id === userId);

    if (index === -1) {
      throw new Error("User not found");
    }

    users[index] = {
      ...users[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    saveUsers(users);

    return successResponse({
      data: removePassword(users[index]),
    });
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export default authService;
