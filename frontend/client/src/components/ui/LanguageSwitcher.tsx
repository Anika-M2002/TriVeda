import React, { startTransition } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "bn", label: "Bengali" },
    { code: "ta", label: "Tamil" },
    { code: "te", label: "Telugu" },
    { code: "mr", label: "Marathi" },
    { code: "gu", label: "Gujarati" },
    { code: "kn", label: "Kannada" },
    { code: "ml", label: "Malayalam" },
    { code: "or", label: "Odia" },
    { code: "pa", label: "Punjabi" },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    startTransition(() => {
      if (selected === "en") {
        i18n.changeLanguage("en");
      } else {
        i18n.changeLanguage("hi");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        background: "linear-gradient(90deg, #e0f7ef 0%, #f8fff6 100%)",
        borderRadius: 28,
        boxShadow: "0 4px 16px 0 rgba(16,185,129,0.10)",
        padding: "8px 22px",
        border: "2px solid #10b981",
        minHeight: 48,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          color: "#065f46",
          fontSize: 16,
          letterSpacing: 0.2,
        }}
      >
        {t("language")}:
      </span>
      <select
        value={i18n.language === "en" ? "en" : "hi"}
        onChange={handleChange}
        style={{
          padding: "8px 22px 8px 14px",
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 16,
          border: "2px solid #34d399",
          background: "#fff",
          color: "#065f46",
          cursor: "pointer",
          minWidth: 140,
          boxShadow: "0 2px 8px #10b98122",
          outline: "none",
          transition: "border 0.2s, box-shadow 0.2s",
        }}
        aria-label="Select language"
        onFocus={(e) =>
          ((e.target as HTMLSelectElement).style.border = "2px solid #059669")
        }
        onBlur={(e) =>
          ((e.target as HTMLSelectElement).style.border = "2px solid #34d399")
        }
        onMouseOver={(e) =>
          ((e.target as HTMLSelectElement).style.border = "2px solid #059669")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLSelectElement).style.border = "2px solid #34d399")
        }
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            style={{ fontWeight: 600, color: "#065f46", background: "#e0f7ef" }}
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
