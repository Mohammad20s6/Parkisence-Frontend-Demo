const now = new Date().toISOString();

const testResultsSeed = [
  {
    _id: "test-1",

    patient: "patient-1",

    testType: "voice",

    fileHash: "voice-hash-001",

    voiceFile: "/audio/example-a.wav",

    imagePath: null,

    status: "completed",

    confidence: 96,

    result: "Healthy",

    advice: "advice-voice-healthy",

    activePattern: null,

    createdAt: now,

    updatedAt: now,
  },

  {
    _id: "test-2",

    patient: "patient-1",

    testType: "drawing",

    fileHash: "drawing-hash-001",

    voiceFile: null,

    imagePath: "/images/spiral-demo.png",

    status: "completed",

    confidence: 92,

    result: "Healthy",

    advice: "advice-drawing-healthy",

    activePattern: "spiral",

    createdAt: now,

    updatedAt: now,
  },

  {
    _id: "test-3",

    patient: "patient-2",

    testType: "voice",

    fileHash: "voice-hash-002",

    voiceFile: "/audio/example-a.wav",

    imagePath: null,

    status: "completed",

    confidence: 82,

    result: "Parkinson",

    advice: "advice-voice-parkinson",

    activePattern: null,

    createdAt: now,

    updatedAt: now,
  },

  {
    _id: "test-4",

    patient: "patient-2",

    testType: "drawing",

    fileHash: "drawing-hash-002",

    voiceFile: null,

    imagePath: "/images/wave-demo.png",

    status: "completed",

    confidence: 88,

    result: "Parkinson",

    advice: "advice-drawing-parkinson",

    activePattern: "wave",

    createdAt: now,

    updatedAt: now,
  },
];

export default testResultsSeed;
