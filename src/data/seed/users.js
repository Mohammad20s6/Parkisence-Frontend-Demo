const now = new Date().toISOString();

const usersSeed = [
  {
    _id: "user-admin",
    name: "System Administrator",
    email: "admin@parkisence.com",
    password: "Admin123",
    role: "admin",
    passwordChangedAt: null,
    createdAt: now,
    updatedAt: now,
  },

  {
    _id: "user-patient-1",
    name: "Healthy Demo",
    email: "healthy@example.com",
    password: "12345678",
    role: "patient",
    passwordChangedAt: null,
    createdAt: now,
    updatedAt: now,
  },

  {
    _id: "user-patient-2",
    name: "Parkinson Demo",
    email: "parkinson@example.com",
    password: "12345678",
    role: "patient",
    passwordChangedAt: null,
    createdAt: now,
    updatedAt: now,
  },
];

export default usersSeed;
