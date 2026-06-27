const now = new Date().toISOString();

const patientsSeed = [
  {
    _id: "patient-1",
    user: "user-patient-1",
    birthDate: "1998-05-12",
    phone: "0999999999",
    gender: "male",
    createdAt: now,
    updatedAt: now,
  },

  {
    _id: "patient-2",
    user: "user-patient-2",
    birthDate: "1965-09-18",
    phone: "0988888888",
    gender: "male",
    createdAt: now,
    updatedAt: now,
  },
];

export default patientsSeed;
