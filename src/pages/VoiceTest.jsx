import styles from "./VoiceTest.module.css";
import { useReducer, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookCheck,
  Mic,
  Square,
  Upload,
  CircleCheckBig,
  Activity,
  RotateCcw,
} from "lucide-react";
import Errore from "../components/ui/ErrorAlert";
import Loading from "../components/ui/Loading";
import BackButton from "../components/ui/BackButton";
import { useTranslation } from "react-i18next";
import { usePatientDashboard } from "../contexts/PatientDashboardContext";
import testService from "../api/testService";
/* ============================= */
/* ====== WAV ENCODING ========= */
/* ============================= */
function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function encodeWav(floatSamples, sampleRate) {
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + floatSamples.length * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + floatSamples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, floatSamples.length * bytesPerSample, true);

  let offset = 44;
  for (let i = 0; i < floatSamples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, floatSamples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function mergeSamples(chunks) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

/* ============================= */
/* ========= REDUCER =========== */
/* ============================= */
const initialState = {
  isRecording: false,
  recordingFinished: false,
  countdown: 0.0,
  lastDuration: 0,
  audioBlob: null,
  audioSource: null,
  isSubmitting: false,
  submitError: "",
  result: null,
  error: "",
  meterWidth: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_RECORDING":
      return {
        ...state,
        isRecording: true,
        recordingFinished: false,
        countdown: 0.0,
        meterWidth: 0,
        error: "",
        submitError: "",
        audioBlob: null,
        audioSource: null,
      };
    case "UPDATE_TIMER":
      return {
        ...state,
        countdown: action.payload,
      };
    case "UPDATE_METER":
      return {
        ...state,
        meterWidth: action.payload,
      };
    case "STOP_RECORDING":
      return {
        ...state,
        isRecording: false,
        meterWidth: 0,
      };
    case "FINISH_RECORDING":
      return {
        ...state,
        recordingFinished: true,
        lastDuration: action.payload.duration,
        audioBlob: action.payload.blob,
        audioSource: action.payload.url,
      };
    case "SET_UPLOADED_AUDIO":
      return {
        ...state,
        audioBlob: action.payload.file,
        audioSource: action.payload.url,
        lastDuration: 0,
        recordingFinished: false,
        isRecording: false,
        error: "",
        submitError: "",
      };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, submitError: "" };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, result: action.payload };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, submitError: action.payload };
    case "SUBMIT_CANCEL":
      return { ...state, isSubmitting: false };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function VoiceTest() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { refreshDashboard } = usePatientDashboard();

  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const samplesRef = useRef([]);
  const timerRef = useRef(null);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  /* ============================= */
  /* ========= FUNCTIONS ========= */
  /* ============================= */

  const cleanupAudio = () => {
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current.onaudioprocess = null;
    }
    if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  };

  const handleStartRecording = async () => {
    try {
      cleanupAudio();
      samplesRef.current = [];
      dispatch({ type: "START_RECORDING" });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      sourceNodeRef.current = audioContext.createMediaStreamSource(stream);
      processorNodeRef.current = audioContext.createScriptProcessor(4096, 1, 1);

      processorNodeRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        samplesRef.current.push(new Float32Array(inputData));

        let maxVal = 0;
        for (let i = 0; i < inputData.length; i++) {
          if (Math.abs(inputData[i]) > maxVal) maxVal = Math.abs(inputData[i]);
        }
        dispatch({
          type: "UPDATE_METER",
          payload: Math.min(100, Math.floor(maxVal * 160)),
        });
      };

      sourceNodeRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContext.destination);

      // 👈 تم تعديل المؤقت ليعتمد كلياً وبدقة على حجم العينات الصوتية المتراكمة بالذاكرة ومعدل التردد
      timerRef.current = setInterval(() => {
        const sampleRate = audioContextRef.current?.sampleRate || 44100;
        const totalSamples = samplesRef.current.reduce(
          (sum, chunk) => sum + chunk.length,
          0,
        );
        const elapsed = totalSamples / sampleRate;

        dispatch({ type: "UPDATE_TIMER", payload: elapsed });

        // التوقف التلقائي الآمن عند استيفاء 5 ثوانٍ حقيقية من الصوت
        if (elapsed >= 5.0) {
          handleStopRecording();
        }
      }, 100);
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: t(
          "voiceTest.micError",
          "فشل الوصول إلى المايكروفون. يرجى منح الصلاحيات.",
        ),
      });
      dispatch({ type: "STOP_RECORDING" });
    }
  };

  const handleStopRecording = () => {
    clearInterval(timerRef.current);
    dispatch({ type: "STOP_RECORDING" });

    // 👈 حساب الوقت الدقيق النهائي بناءً على العينات المجمعة قبل تنظيف الـ Context
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const mergedSamples = mergeSamples(samplesRef.current);
    const elapsed = mergedSamples.length / sampleRate;

    cleanupAudio();

    if (elapsed < 3.0) {
      dispatch({
        type: "SET_ERROR",
        payload: t(
          "voiceTest.tooShort",
          "التسجيل قصير جداً. يرجى التسجيل لمدة تتراوح بين 3 إلى 5 ثوانٍ.",
        ),
      });
      return;
    }

    const wavBlob = encodeWav(mergedSamples, sampleRate);
    const blobUrl = URL.createObjectURL(wavBlob);

    dispatch({
      type: "FINISH_RECORDING",
      payload: { duration: elapsed, blob: wavBlob, url: blobUrl },
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (
      !file.name.toLowerCase().endsWith(".wav") &&
      !file.type.includes("wav")
    ) {
      dispatch({
        type: "SET_ERROR",
        payload: t("voiceTest.wavOnly", "WAV يرجى رفع ملف بصيغة "),
      });
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    dispatch({
      type: "SET_UPLOADED_AUDIO",
      payload: { file, url: fileUrl },
    });
  };

  const handleResetPage = () => {
    cleanupAudio();
    clearInterval(timerRef.current);
    if (state.audioSource) {
      URL.revokeObjectURL(state.audioSource);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    dispatch({ type: "RESET" });
  };

  const handleSubmit = async () => {
    if (!state.audioBlob) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      const response = await testService.submitVoiceTest(state.audioBlob);

      dispatch({
        type: "SUBMIT_SUCCESS",
        payload: response.data.test,
      });

      await refreshDashboard();

      navigate(`/patient/history/${response.data.test._id}`, {
        state: {
          isDuplicate: false,
          duplicateMessage: null,
        },
      });
    } catch (error) {
      console.error("Voice test error:", error);

      dispatch({
        type: "SUBMIT_ERROR",
        payload: error.message || t("voiceTest.failedAnalyze"),
      });
    }
  };

  const handleCancel = () => {
    dispatch({
      type: "SUBMIT_CANCEL",
    });
  };
  useEffect(() => {
    return () => {
      cleanupAudio();
      clearInterval(timerRef.current);
    };
  }, []);

  /* ============================= */
  /* ========= RENDER ============ */
  /* ============================= */
  const displayedTime = state.isRecording
    ? state.countdown
    : state.recordingFinished
      ? state.lastDuration
      : 0;
  const canStop = state.countdown >= 3.0;
  return (
    <>
      <BackButton />
      {state.isSubmitting && <Loading onHandelCancel={handleCancel} />}

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {t("voiceTest.title", "اختبار الصوت")}
          </h1>
          <p className={styles.description}>
            {t(
              "voiceTest.description",
              "قم بتسجيل صوتك أو رفع ملف WAV لتحليله.",
            )}
          </p>

          <div className={styles.instructions}>
            <ul>
              <div className={styles.instractionsTitle}>
                <BookCheck size={18} />
                {t("voiceTest.instructionsTitle", "التعليمات:")}
              </div>
              <li>
                {t(
                  "voiceTest.instruction1",
                  "اجلس في مكان هادئ خالي من الضجيج.",
                )}
              </li>
              <li>
                {t("voiceTest.instruction2", "خذ نفساً عميقاً قبل البدء.")}
              </li>
              <li>
                {t(
                  "voiceTest.instruction3",
                  "انطق حرف 'آآآ' بصوت ثابت ومستمر.",
                )}
              </li>
              <li>
                {t(
                  "voiceTest.instruction4",
                  "يجب أن يكون التسجيل بين 3 إلى 5 ثوانٍ.",
                )}
              </li>
              <li>
                {t(
                  "voiceTest.instruction5",
                  "يمكنك رفع ملف بصيغة WAV كبديل للتسجيل.",
                )}
              </li>
            </ul>
          </div>

          <div className={styles.testWordWrapper}>
            <p className={styles.testWord}>
              {t("voiceTest.testWord", "آآآآآآ")}
            </p>
            <p className={styles.durationHint}>
              {t("voiceTest.durationHint", "من 3 إلى 5 ثوانٍ")}
            </p>
          </div>

          {/* Example Audio */}
          <div className={styles.exampleSection}>
            <div className={styles.exampleHeader}>
              <span className={styles.exampleTitle}>
                {t("voiceTest.exampleRecord", "مثال للتسجيل الصحيح:")}
              </span>
            </div>
            <div className={styles.audioPlayer}>
              <audio controls controlsList="nodownload">
                <source src="/audio/example-a.wav" type="audio/mp3" />
              </audio>
            </div>
          </div>

          <div className={styles.recorderSection}>
            {!state.isRecording ? (
              <button
                className={styles.recordButton}
                onClick={handleStartRecording}
              >
                <Mic size={32} />
              </button>
            ) : (
              <button
                className={`${styles.recordButton} ${styles.recording} ${!canStop ? styles.disabledStop : ""}`}
                onClick={handleStopRecording}
                disabled={!canStop}
              >
                <Square size={28} />
              </button>
            )}
          </div>

          {(state.isRecording || state.recordingFinished) && (
            <div className={styles.recordingInfo}>
              <div className={styles.meterContainer}>
                <div
                  className={styles.meterBar}
                  style={{ width: `${state.meterWidth}%` }}
                ></div>
              </div>

              <span className={styles.countdown}>
                00:0{displayedTime.toFixed(1)}
              </span>

              <div className={styles.recordingText}>
                {state.recordingFinished ? (
                  <div className={styles.complateMessage}>
                    <CircleCheckBig size={16} className={styles.complateIcon} />
                    <span>
                      {t("voiceTest.recordingComplete", "اكتمل التسجيل")}
                    </span>
                  </div>
                ) : (
                  <span>
                    {!canStop
                      ? t("voiceTest.keepRecording", "استمر في التسجيل...")
                      : t("common.recording", "جاري التسجيل...")}
                  </span>
                )}
              </div>
            </div>
          )}

          {state.audioSource && (
            <div className={styles.exampleSection}>
              <div className={styles.exampleHeader}>
                <span className={styles.exampleTitle}>
                  {t("voiceTest.yourRecording", "تسجيلك الحالي (المرجعي):")}
                </span>
              </div>
              <div className={styles.audioPlayer}>
                <audio
                  controls
                  controlsList="nodownload"
                  src={state.audioSource}
                />
              </div>
            </div>
          )}

          <div className={styles.orWrapper}>
            <div className={styles.orLine}></div>
            <span className={styles.orText}>{t("common.or", "أو")}</span>
            <div className={styles.orLine}></div>
          </div>

          <div className={styles.uploadSection}>
            <input
              type="file"
              accept=".wav,audio/wav"
              ref={fileInputRef}
              className={styles.hiddenInput}
              onChange={handleFileUpload}
            />

            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={16} />{" "}
              {t("voiceTest.uploadAudio", "رفع ملف صوتي (WAV)")}
            </button>

            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetPage}
            >
              <RotateCcw size={16} /> {t("common.reset", "إعادة ضبط")}
            </button>
          </div>

          <div className={styles.error}>
            {(state.error || state.submitError) && (
              <Errore error={state.error || state.submitError} />
            )}
          </div>

          <button
            className={`${styles.submitButton} ${state.audioBlob ? styles.submitActive : ""}`}
            disabled={!state.audioBlob || state.isSubmitting}
            onClick={handleSubmit}
          >
            <Activity size={18} style={{ marginRight: "8px" }} />
            {t("common.submit", "تحليل وإرسال")}
          </button>
        </div>
      </div>
    </>
  );
}

export default VoiceTest;
