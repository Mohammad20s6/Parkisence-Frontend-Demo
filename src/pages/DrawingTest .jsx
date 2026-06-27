import styles from "./DrawingTest.module.css";
import { useReducer, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookCheck,
  Upload,
  RotateCcw,
  Send,
  PenTool,
  Waves,
  Orbit,
} from "lucide-react";
import Loading from "../components/ui/Loading";
import ErrorAlert from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";
import { useTranslation } from "react-i18next";
import { usePatientDashboard } from "../contexts/PatientDashboardContext";

/* ============================= */
/* ========= REDUCER =========== */
/* ============================= */

const initialState = {
  activePattern: "spiral",
  isDrawing: false,
  points: [],
  image: null,
  preview: null,
  isSubmitting: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_PATTERN":
      return {
        ...state,
        activePattern: action.payload,
        points: [],
        image: null,
        preview: null,
        error: "",
      };
    case "START_DRAW":
      return { ...state, isDrawing: true };
    case "STOP_DRAW":
      return { ...state, isDrawing: false };
    case "ADD_POINT":
      return { ...state, points: [...state.points, action.payload] };
    case "RESET":
      return { ...state, points: [], image: null, preview: null, error: "" };
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload.file,
        preview: action.payload.url,
        points: [],
        error: "",
      };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: "" };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.payload };
    case "SUBMIT_CANCEL":
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}

function DrawingTest() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const canvasShellRef = useRef(null);
  const ctxRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const imageRef = useRef(null);
  const hasStrokeRef = useRef(false);

  const draftsRef = useRef({
    spiral: null,
    wave: null,
  });

  const canvasSizeRef = useRef({
    size: 0,
    ratio: 1,
  });

  const { refreshDashboard } = usePatientDashboard();

  /* ============================= */
  /* ======== REF SYNC =========== */
  /* ============================= */

  useEffect(() => {
    isDrawingRef.current = state.isDrawing;
  }, [state.isDrawing]);

  useEffect(() => {
    imageRef.current = state.image;
  }, [state.image]);

  /* ============================= */
  /* ===== CANVAS HELPERS ======== */
  /* ============================= */

  const setupCanvasSurface = useCallback(() => {
    const canvas = canvasRef.current;
    const shell = canvasShellRef.current;

    if (!canvas || !shell) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rect = shell.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height));
    const ratio = window.devicePixelRatio || 1;

    if (!size) return null;

    canvas.width = size * ratio;
    canvas.height = size * ratio;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(ratio, ratio);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;

    canvasSizeRef.current = { size, ratio };
    hasStrokeRef.current = false;

    return { size, ratio };
  }, []);

  /* ============================= */
  /* ===== GUIDE LAYER HELPER ==== */
  /* ============================= */

  const setupGuideSurface = useCallback(() => {
    const guideCanvas = guideCanvasRef.current;
    const { size, ratio } = canvasSizeRef.current;
    if (!guideCanvas || !size) return;

    const ctx = guideCanvas.getContext("2d");

    guideCanvas.width = size * ratio;
    guideCanvas.height = size * ratio;
    guideCanvas.style.width = `${size}px`;
    guideCanvas.style.height = `${size}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    ctx.scale(ratio, ratio);

    ctx.strokeStyle = "rgba(15, 118, 110, 0.25)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([12, 12]);

    if (state.activePattern === "spiral") {
      const cx = size / 2;
      const cy = size / 2;

      const turns = 3.0;
      const maxTheta = turns * 2 * Math.PI;

      const maxRadius = (size * 0.85) / 2;
      const b = maxRadius / maxTheta;

      ctx.beginPath();
      for (let theta = 0; theta <= maxTheta; theta += 0.05) {
        const r = b * theta;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);

        if (theta === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    } else {
      const centerY = size / 2;
      const startX = size * 0.075;
      const endX = size * 0.925;
      const width = endX - startX;

      const cycles = 2.0;
      const amplitude = (size * 0.85) / 2;

      ctx.beginPath();
      for (let x = startX; x <= endX; x += 1) {
        const t = (x - startX) / width;
        const y = centerY + amplitude * Math.cos(t * cycles * 2 * Math.PI);

        if (x === startX) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }, [state.activePattern]);

  /* ============================= */
  /* ===== RESTORE DRAFT ========= */
  /* ============================= */

  const restoreCanvasDraft = useCallback((pattern) => {
    const draft = draftsRef.current[pattern];
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!draft || !canvas || !ctx) return;

    const { size, ratio } = canvasSizeRef.current;
    const image = new Image();

    image.onload = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(ratio, ratio);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, 0, 0, size, size);

      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      hasStrokeRef.current = true;
    };

    image.src = draft;
  }, []);

  /* ============================= */
  /* ===== INIT CANVAS =========== */
  /* ============================= */

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setupCanvasSurface();
      setupGuideSurface();
      restoreCanvasDraft(state.activePattern);
    }, 50);

    const handleResize = () => {
      const currentCanvas = canvasRef.current;
      if (currentCanvas && hasStrokeRef.current) {
        draftsRef.current[state.activePattern] =
          currentCanvas.toDataURL("image/png");
      }
      setupCanvasSurface();
      setupGuideSurface();
      restoreCanvasDraft(state.activePattern);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    state.activePattern,
    setupCanvasSurface,
    setupGuideSurface,
    restoreCanvasDraft,
  ]);

  /* ============================= */
  /* ===== POINT CALCULATOR ====== */
  /* ============================= */

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  /* ============================= */
  /* ========= DRAW START ======== */
  /* ============================= */

  const startDrawing = (event) => {
    if (event.cancelable) event.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (imageRef.current) {
      imageRef.current = null;
      dispatch({ type: "SET_IMAGE", payload: { file: null, url: null } });
    }

    const { x, y } = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(x, y);

    isDrawingRef.current = true;
    hasStrokeRef.current = true;

    dispatch({ type: "START_DRAW" });
    dispatch({ type: "ADD_POINT", payload: [x, y] });
  };

  /* ============================= */
  /* ========= DRAW MOVE ========= */
  /* ============================= */

  const draw = (event) => {
    if (!isDrawingRef.current) return;
    if (event.cancelable) event.preventDefault();

    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();

    dispatch({ type: "ADD_POINT", payload: [x, y] });
  };

  /* ============================= */
  /* ========= DRAW END ========== */
  /* ============================= */

  const stopDrawing = () => {
    isDrawingRef.current = false;
    dispatch({ type: "STOP_DRAW" });
  };

  /* ============================= */
  /* ======== PATTERN CHANGE ===== */
  /* ============================= */

  const handlePatternChange = (pattern) => {
    if (pattern === state.activePattern) return;
    const canvas = canvasRef.current;

    if (canvas && hasStrokeRef.current) {
      draftsRef.current[state.activePattern] = canvas.toDataURL("image/png");
    }

    dispatch({ type: "SET_PATTERN", payload: pattern });
  };

  /* ============================= */
  /* ============ RESET ========== */
  /* ============================= */

  const handleReset = () => {
    draftsRef.current[state.activePattern] = null;
    hasStrokeRef.current = false;
    imageRef.current = null;
    isDrawingRef.current = false;

    dispatch({ type: "RESET" });
    setupCanvasSurface();
    setupGuideSurface();
  };

  /* ============================= */
  /* ============ UPLOAD ========= */
  /* ============================= */

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    imageRef.current = file;

    dispatch({ type: "SET_IMAGE", payload: { file, url } });
  };

  /* ============================= */
  /* ===== CANVAS TO FILE ======== */
  /* ============================= */

  const canvasToFile = () => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error("Canvas not found"));
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to generate image"));
            return;
          }
          const file = new File([blob], "drawing-test.png", {
            type: "image/png",
          });
          resolve(file);
        },
        "image/png",
        1,
      );
    });
  };

  /* ============================= */
  /* ============ SUBMIT ========= */
  /* ============================= */

  const handleSubmit = async () => {
    if (state.points.length === 0 && !state.image) return;

    dispatch({ type: "SUBMIT_START" });
    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const formData = new FormData();

      if (state.image) {
        formData.append("imageFile", state.image);
      } else {
        const canvasFile = await canvasToFile();
        formData.append("imageFile", canvasFile);
      }

      formData.append("activePattern", state.activePattern);

      const response = await fetch("http://127.0.0.1:3000/api/tests/drawing", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || t("drawingTest.failedAnalyze"));

      dispatch({ type: "SUBMIT_SUCCESS" });
      const createdTestId = result?.data?.test?._id;
      await refreshDashboard();

      if (createdTestId) {
        // تمرير حالة التكرار عبر الـ state لتستقبلها صفحة النتائج
        navigate(`/patient/history/${createdTestId}`, {
          state: {
            isDuplicate:
              result.isDuplicate ||
              result.message?.includes("already") ||
              false,
            duplicateMessage: result.message,
          },
        });
      } else {
        navigate("/patient/history");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        dispatch({ type: "SUBMIT_CANCEL" });
        return;
      }
      dispatch({
        type: "SUBMIT_ERROR",
        payload: err.message || t("drawingTest.failedAnalyze"),
      });
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    dispatch({ type: "SUBMIT_CANCEL" });
  };

  return (
    <>
      {state.isSubmitting && <Loading onHandelCancel={handleCancel} />}

      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <BackButton />
        </div>

        <div className={styles.layout}>
          {/* LEFT SECTION */}
          <div className={styles.leftSection}>
            <div className={styles.card}>
              <h1 className={styles.title}>{t("drawingTest.title")}</h1>
              <p className={styles.description}>
                {state.activePattern === "spiral"
                  ? t("drawingTest.spiralDescription")
                  : t("drawingTest.waveDescription")}
              </p>

              <div className={styles.patternSwitcher}>
                <button
                  className={`${styles.patternBtn} ${state.activePattern === "spiral" ? styles.activePattern : ""}`}
                  onClick={() => handlePatternChange("spiral")}
                >
                  <Orbit size={16} /> {t("drawingTest.spiral")}
                </button>
                <button
                  className={`${styles.patternBtn} ${state.activePattern === "wave" ? styles.activePattern : ""}`}
                  onClick={() => handlePatternChange("wave")}
                >
                  <Waves size={16} /> {t("drawingTest.wave")}
                </button>
              </div>

              <div className={styles.instructions}>
                <div className={styles.instructionsTitle}>
                  <BookCheck size={18} /> {t("drawingTest.instructionsTitle")}
                </div>
                <ul>
                  {state.activePattern === "spiral" ? (
                    <>
                      <li>{t("drawingTest.spiralInstruction1")}</li>
                      <li>{t("drawingTest.spiralInstruction2")}</li>
                      <li>{t("drawingTest.spiralInstruction3")}</li>
                    </>
                  ) : (
                    <>
                      <li>{t("drawingTest.waveInstruction1")}</li>
                      <li>{t("drawingTest.waveInstruction2")}</li>
                      <li>{t("drawingTest.waveInstruction3")}</li>
                    </>
                  )}
                </ul>
              </div>

              <div className={styles.guideSection}>
                <div className={styles.guideHeader}>
                  <PenTool size={16} />{" "}
                  <span>{t("drawingTest.howToDraw")}</span>
                </div>
                {state.activePattern === "spiral" ? (
                  <svg viewBox="0 0 250 250" className={styles.spiralSvg}>
                    <path
                      className={styles.spiralPathGuide}
                      d="M 125,125 m 0,0 c 2.3,-0.1 4.7,0.1 6.8,0.7 7.7,2.3 12.3,10.3 10.3,18 c -3,11.5 -15.5,18.4 -27,15.4 -17.2,-4.5 -27.6,-23.2 -23.1,-40.5 6,-23 31,-36.8 54,-30.7 28.7,7.5 46,38.7 38.5,67.5 -9,34.5 -46.5,55.2 -81,46.2 -40.2,-10.5 -64.4,-54.2 -53.9,-94.5 12,-46 62,-73.6 108,-61.6"
                    />
                    <path
                      pathLength="1"
                      className={styles.spiralPathDraw}
                      d="M 125,125 m 0,0 c 2.3,-0.1 4.7,0.1 6.8,0.7 7.7,2.3 12.3,10.3 10.3,18 c -3,11.5 -15.5,18.4 -27,15.4 -17.2,-4.5 -27.6,-23.2 -23.1,-40.5 6,-23 31,-36.8 54,-30.7 28.7,7.5 46,38.7 38.5,67.5 -9,34.5 -46.5,55.2 -81,46.2 -40.2,-10.5 -64.4,-54.2 -53.9,-94.5 12,-46 62,-73.6 108,-61.6"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 400 300" className={styles.waveSvg}>
                    <path
                      d="M 0 260 Q 25 260, 50 150 T 100 40 T 150 150 T 200 260 T 250 150 T 300 40 T 350 150 T 400 260"
                      className={styles.wavePath}
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className={styles.rightSection}>
            <div className={styles.card}>
              <div className={styles.drawHeader}>
                <PenTool size={18} />
                <div>
                  <h3>
                    {state.activePattern === "spiral"
                      ? t("drawingTest.spiralDrawHeaderTitle")
                      : t("drawingTest.waveDrawHeaderTitle")}
                  </h3>
                  <p>
                    {state.activePattern === "spiral"
                      ? t("drawingTest.spiralDrawHeaderSubtitle")
                      : t("drawingTest.waveDrawHeaderSubtitle")}
                  </p>
                </div>
              </div>

              {/* CANVAS WRAPPER */}
              <div className={styles.canvasWrapper} ref={canvasShellRef}>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                />

                <canvas ref={guideCanvasRef} className={styles.guideCanvas} />
              </div>

              <div className={styles.actions}>
                <button onClick={handleReset} className={styles.resetBtn}>
                  <RotateCcw size={16} /> {t("drawingTest.reset")}
                </button>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleUpload}
                />
                <button
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} /> {t("drawingTest.uploadImage")}
                </button>
              </div>

              {state.preview && (
                <img
                  src={state.preview}
                  alt="preview"
                  className={styles.preview}
                />
              )}
              {state.error && (
                <div className={styles.error}>
                  <ErrorAlert error={state.error} />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={state.points.length === 0 && !state.image}
                className={`${styles.submitButton} ${state.points.length > 0 || state.image ? styles.submitActive : ""}`}
              >
                <Send size={16} /> {t("common.submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DrawingTest;
