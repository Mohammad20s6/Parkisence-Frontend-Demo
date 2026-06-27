import styles from "./PatientProfile.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import Loading from "../components/ui/Loading";
import BackButton from "../components/ui/BackButton";
import { useTranslation } from "react-i18next";

function PatientProfile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    gender: "",
  });

  const [originalData, setOriginalData] = useState(formData);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (user) {
      const patient = user.patientProfile || {};

      const initialData = {
        name: user.name || "",
        email: user.email || "",
        birthDate: patient.birthDate ? patient.birthDate.split("T")[0] : "",
        phone: patient.phone || "",
        gender: patient.gender || "",
      };

      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  // ================= INPUT =================
  function handleInputChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        phone: onlyDigits,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEdit() {
    setMessage(null);
    setOriginalData(formData);
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData(originalData);
    setIsEditing(false);
    setMessage(null);
  }

  // ================= SAVE =================
  async function handleSave() {
    try {
      setIsLoading(true);
      setMessage(null);

      // ================= VALIDATION =================

      if (formData.birthDate) {
        const selectedDate = new Date(formData.birthDate);

        if (selectedDate > new Date()) {
          throw new Error("Birth date cannot be in the future");
        }
      }

      if (
        formData.phone &&
        (formData.phone.length < 8 || formData.phone.length > 15)
      ) {
        throw new Error("Phone number must be between 8 and 15 digits");
      }

      // ================= BUILD UPDATE =================

      const updates = {};

      if (formData.name !== originalData.name) updates.name = formData.name;

      if (formData.email !== originalData.email) updates.email = formData.email;

      if (formData.phone !== originalData.phone) updates.phone = formData.phone;

      if (formData.birthDate !== originalData.birthDate) {
        updates.birthDate =
          formData.birthDate === "" ? null : formData.birthDate;
      }

      if (formData.gender !== originalData.gender) {
        updates.gender = formData.gender === "" ? "none" : formData.gender;
      }

      // ================= SAVE =================

      if (Object.keys(updates).length > 0) {
        await updateUser(updates);
      }

      setOriginalData(formData);

      setIsEditing(false);

      setMessage(t("patient.profile.updated"));
    } catch (error) {
      console.error(error);

      setMessage(error.message || t("patient.profile.error"));
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <div className={styles.back}>
        <BackButton />
      </div>

      <section className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("patient.profile.title")}</h1>
          <p className={styles.subtitle}>{t("patient.profile.subtitle")}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              <User size={36} className={styles.userIcon} />
            </div>
            <div>
              <h2 className={styles.username}>{user.name}</h2>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>

          {isLoading && <Loading />}

          <div className={styles.form}>
            <div className={styles.field}>
              <label>{t("patient.profile.fullName")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.field}>
              <label>{t("patient.profile.emailAddress")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </div>

            {/* ROW */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label>{t("patient.profile.birthDate")}</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.field}>
                <label>{t("patient.profile.gender")}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  disabled={!isEditing}
                  onChange={handleInputChange}
                >
                  <option value="">None</option>
                  <option value="male">{t("common.male")}</option>
                  <option value="female">{t("common.female")}</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>{t("patient.profile.phone")}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                disabled={!isEditing}
                onChange={handleInputChange}
                maxLength={15}
              />
            </div>

            <div className={styles.actions}>
              {isEditing && (
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={handleCancel}
                >
                  {t("patient.profile.cancel")}
                </button>
              )}

              {!isEditing ? (
                <button
                  type="button"
                  className={styles.primary}
                  onClick={handleEdit}
                >
                  {t("patient.profile.editProfile")}
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.primary}
                  onClick={handleSave}
                >
                  {t("patient.profile.save")}
                </button>
              )}
            </div>
          </div>

          {message && <span className={styles.message}>{message}</span>}
        </div>
      </section>
    </>
  );
}

export default PatientProfile;
