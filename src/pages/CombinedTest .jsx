import { useTranslation } from "react-i18next";

function CombinedTest() {
  const { t } = useTranslation();
  return <div>{t("combinedTestPage.placeholder")}</div>;
}

export default CombinedTest;
