import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

import Navbar from "../components/layout/Navbar";
import ErrorAlert from "../components/ui/ErrorAlert.jsx";
import Loading from "../components/ui/Loading.jsx";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFormValid =
    email.trim() !== "" &&
    fullName.trim() !== "" &&
    password.trim() !== "" &&
    confirmPass.trim() !== "" &&
    password === confirmPass;

  const { register, user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setError(null);
    setIsLoading(true);

    try {
      await register(email, password, fullName);
    } catch (err) {
      setError(err.message || t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") navigate("/admin");
    else navigate("/patient");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <section className={styles.page}>
        {/* Left (Info / Image) */}
        <div className={styles.left}>
          <div className={styles.rightContent}>
            <div className={styles.logoContainer}>
              <img
                src="/imges/parkisense-logo-3.png"
                alt="ParkiSense Logo"
                className={styles.heroLogo}
              />
            </div>
            <h2>{t("auth.register.sideTitle")}</h2>
            <p>{t("auth.register.sideText")}</p>
          </div>
        </div>

        {/* Right (Form) */}
        <div className={styles.right}>
          <div className={styles.box}>
            {/* Heading */}
            <div className={styles.heading}>
              <h1>{t("auth.register.title")}</h1>
              <p>{t("auth.register.subtitle")}</p>
            </div>

            {/* erore alert */}
            {error && <ErrorAlert error={error} />}
            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className={styles.field}>
                <label>{t("auth.register.fullName")}</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.icon} />
                  <input
                    type="text"
                    placeholder={t("auth.placeholders.fullName")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.field}>
                <label>{t("auth.register.email")}</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.icon} />
                  <input
                    type="email"
                    placeholder={t("auth.placeholders.email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.field}>
                <label>{t("auth.register.password")}</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.icon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.placeholders.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={`${styles.eye} ${
                      showPassword ? styles.eyeActive : ""
                    }`}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className={styles.field}>
                <label>{t("auth.register.confirmPassword")}</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.icon} />
                  <input
                    type="password"
                    placeholder={t("auth.placeholders.password")}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submit}
                disabled={!isFormValid || isLoading}
              >
                {isLoading
                  ? t("common.creatingAccount")
                  : t("auth.register.title")}
              </button>
            </form>

            {/* Footer */}
            <p className={styles.footer}>
              {t("auth.register.hasAccount")}{" "}
              <Link to="/login">{t("navbar.login")}</Link>
            </p>
          </div>
        </div>
      </section>
      {/* isloading component */}
      {isLoading && <Loading />}
    </div>
  );
}

export default Register;
