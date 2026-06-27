import styles from "./Login.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

import Navbar from "../components/layout/Navbar";
import ErrorAlert from "../components/ui/ErrorAlert.jsx";
import Loading from "../components/ui/Loading.jsx";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const { login, user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
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
        {/* Left */}
        <div className={styles.left}>
          <div className={styles.box}>
            {/* Heading */}
            <div className={styles.heading}>
              <h1>{t("auth.login.welcomeBack")}</h1>
              <p>{t("auth.login.subtitle")}</p>
            </div>

            {/* error alert */}
            {error && <ErrorAlert error={error} />}
            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email */}
              <div className={styles.field}>
                <label>{t("auth.login.email")}</label>
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
                <label>{t("auth.login.password")}</label>
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

              {/* Actions */}
              <div className={styles.actions}>
                <Link to="#">{t("auth.login.forgotPassword")}</Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submit}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? t("common.signingIn") : t("auth.login.signIn")}
              </button>
            </form>

            {/* Footer */}
            <p className={styles.footer}>
              {t("auth.login.noAccount")}{" "}
              <Link to="/register">{t("navbar.register")}</Link>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.logoContainer}>
              <img
                src="/imges/parkisense-logo-3.png"
                alt="ParkiSense Logo"
                className={styles.heroLogo}
              />
            </div>
            <h2>{t("auth.login.sideTitle")}</h2>
            <p>{t("auth.login.sideText")}</p>
          </div>
        </div>
      </section>
      {isLoading && <Loading />}
    </div>
  );
}

export default Login;
