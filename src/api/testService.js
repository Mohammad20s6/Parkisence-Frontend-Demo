import storageService from "../storage/storageService";
import { STORAGE_KEYS } from "../storage/storageKeys";
import { delay } from "../utils/delay";
import { generateId } from "../utils/generateId";

function getCurrentUser() {
  const user = storageService.getCollection(STORAGE_KEYS.CURRENT_USER);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

function getTests() {
  return storageService.getCollection(STORAGE_KEYS.TEST_RESULTS) || [];
}

function saveTests(tests) {
  storageService.saveCollection(STORAGE_KEYS.TEST_RESULTS, tests);
}

// تعديل الدالة لتعمل في الحالتين (جلب الكل أو البحث بناءً على النوع والنتيجة)
function getAdvice(testType, result) {
  const adviceList = storageService.getCollection(STORAGE_KEYS.ADVICE) || [];

  if (testType && result) {
    // افترضنا هنا أن مفتاح النوع في قاعدة البيانات هو testType
    return adviceList.find(
      (item) => item.testType === testType && item.result === result,
    );
  }

  return adviceList;
}

function getPatientId() {
  const currentUser = getCurrentUser();
  return currentUser.patientProfile._id;
}

// =======================================
// GET ALL TESTS
// =======================================

async function getMyTests() {
  await delay();

  const patientId = getPatientId();

  const tests = getTests()
    .filter((test) => test.patient === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return {
    status: "success",
    data: {
      tests,
    },
  };
}

// =======================================
// GET TEST DETAILS
// =======================================

async function getTestById(testId) {
  await delay();

  const patientId = getPatientId();

  const test = getTests().find(
    (item) => item._id === testId && item.patient === patientId,
  );

  if (!test) {
    throw new Error("Test not found");
  }

  const advice = getAdvice().find((item) => item._id === test.advice);

  return {
    status: "success",
    data: {
      test: {
        ...test,
        advice,
      },
    },
  };
}

// =======================================
// DASHBOARD STATS
// =======================================

async function getMyStats() {
  await delay();

  const patientId = getPatientId();

  const tests = getTests().filter((item) => item.patient === patientId);

  const voiceTests = tests.filter((item) => item.testType === "voice").length;
  const drawingTests = tests.filter(
    (item) => item.testType === "drawing",
  ).length;
  const healthy = tests.filter((item) => item.result === "Healthy").length;
  const parkinson = tests.filter((item) => item.result === "Parkinson").length;

  return {
    status: "success",
    data: {
      totalTests: tests.length,
      voiceTests,
      drawingTests,
      healthy,
      parkinson,
    },
  };
}

// =======================================
// HEALTH SUMMARY
// =======================================

async function getHealthyStats() {
  await delay();

  const patientId = getPatientId();

  const tests = getTests().filter((item) => item.patient === patientId);

  if (tests.length === 0) {
    return {
      status: "success",
      data: {
        percentage: 0,
      },
    };
  }

  const healthyCount = tests.filter((item) => item.result === "Healthy").length;

  return {
    status: "success",
    data: {
      percentage: Math.round((healthyCount / tests.length) * 100),
    },
  };
}

// =======================================
// SERVICE EXPORT OBJECT
// =======================================
// هنا قمنا بإنشاء الكائن الذي يجمع كل الدوال لتصديره بشكل صحيح

const testService = {
  getMyTests,
  getTestById,
  getMyStats,
  getHealthyStats,

  async submitVoiceTest(audioBlob) {
    await delay(1500);

    const patientId = getPatientId(); // تم الإصلاح هنا
    const tests = getTests();

    const randomConfidence = Math.floor(Math.random() * 101);
    const result = randomConfidence >= 50 ? "Healthy" : "Parkinson";
    const adviceObj = getAdvice("voice", result); // استدعاء دالة النصيحة المعدلة

    const newTest = {
      _id: generateId(),
      patient: patientId,
      testType: "voice",
      fileHash: generateId(),
      voiceFile: "/audio/example-a.wav",
      imagePath: null,
      status: "completed",
      confidence: randomConfidence,
      result,
      advice: adviceObj?._id || null,
      activePattern: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tests.unshift(newTest);
    saveTests(tests);

    return {
      message: "Voice analyzed successfully",
      isDuplicate: false,
      data: {
        test: {
          ...newTest,
          advice: adviceObj,
        },
      },
    };
  },

  async submitDrawingTest(activePattern, imageFile) {
    await delay(1800);

    const patientId = getPatientId(); // تم الإصلاح هنا
    const tests = getTests();

    const randomConfidence = Math.floor(Math.random() * 101);
    const result = randomConfidence >= 50 ? "Healthy" : "Parkinson";
    const adviceObj = getAdvice("drawing", result); // استدعاء دالة النصيحة المعدلة

    const newTest = {
      _id: generateId(),
      patient: patientId,
      testType: "drawing",
      fileHash: generateId(),
      voiceFile: null,
      imagePath:
        activePattern === "spiral"
          ? "/images/spiral-demo.png"
          : "/images/wave-demo.png",
      status: "completed",
      confidence: randomConfidence,
      result,
      advice: adviceObj?._id || null,
      activePattern,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tests.unshift(newTest);
    saveTests(tests);

    return {
      message: "Drawing analyzed successfully",
      isDuplicate: false,
      data: {
        test: {
          ...newTest,
          advice: adviceObj,
        },
      },
    };
  },
};

export default testService;
