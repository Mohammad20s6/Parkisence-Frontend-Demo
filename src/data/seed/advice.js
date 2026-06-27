const adviceSeed = [
  {
    _id: "advice-healthy-voice",
    testType: "voice",
    result: "Healthy",
    message: "All clear. No signs of Parkinson detected. You are healthy.",
  },

  {
    _id: "advice-parkinson-voice",
    testType: "voice",
    result: "Parkinson",
    message:
      "The analysis indicates possible Parkinson's disease. Please consult a neurologist for a complete evaluation.",
  },

  {
    _id: "advice-healthy-drawing",
    testType: "drawing",
    result: "Healthy",
    message:
      "Your drawing appears normal without noticeable Parkinson-related characteristics.",
  },

  {
    _id: "advice-parkinson-drawing",
    testType: "drawing",
    result: "Parkinson",
    message:
      "Your drawing contains patterns associated with Parkinson's disease. Please consult a healthcare professional.",
  },
];

export default adviceSeed;
