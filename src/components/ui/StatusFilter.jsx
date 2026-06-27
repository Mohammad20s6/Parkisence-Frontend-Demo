import SelectFilter from "./SelectFilter";
import { useTranslation } from "react-i18next";

function StatusFilter({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <SelectFilter
      value={value}
      onChange={onChange}
      options={[
        { value: "all", label: t("filters.allLevels") },
        { value: "low", label: t("filters.lowRisk") },
        { value: "moderate", label: t("filters.moderate") },
        { value: "high", label: t("filters.highRisk") },
      ]}
    />
  );
}

export default StatusFilter;
