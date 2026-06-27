import { useTranslation } from "react-i18next";

function AdminFAQ() {
  const { t } = useTranslation();
  return <div>{t("adminFaqPage.placeholder")}</div>;
}

export default AdminFAQ;
