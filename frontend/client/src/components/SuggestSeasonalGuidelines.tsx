import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SeasonalGuideline {
  season_id: string;
  season_name: string;
  region: string;
  dosha_focus: string;
  recommended_foods: string[];
  avoided_foods: string[];
  general_guidelines: string;
  lifestyle_recommendations?: string;
  seasonal_allergies_precautions?: string;
  data_source: string;
}

interface PatientProfile {
  id: string;
  name: string;
  prakriti: string;
  location: string;
}

interface SuggestSeasonalGuidelinesProps {
  patient: PatientProfile;
  onClose: () => void;
  onSend: (guideline: SeasonalGuideline) => void;
}

const mockGuidelines: SeasonalGuideline[] = [
  {
    season_id: "SHARAD-IND-NORTH",
    season_name: "Sharad",
    region: "India-North",
    dosha_focus: "pitta",
    recommended_foods: ["Rice", "Barley", "Ghee"],
    avoided_foods: ["Spicy food", "Fermented food"],
    general_guidelines: "Eat cooling foods, avoid heat and excessive sun.",
    lifestyle_recommendations: "Gentle exercise, avoid anger.",
    seasonal_allergies_precautions: "Beware of pollen.",
    data_source: "synthetic",
  },
  // ... more mock data
];

const SuggestSeasonalGuidelines: React.FC<SuggestSeasonalGuidelinesProps> = ({
  patient,
  onClose,
  onSend,
}) => {
  const { t } = useTranslation(["components/SuggestSeasonalGuidelines"]);
  const [guideline, setGuideline] = useState<SeasonalGuideline | null>(null);
  const [editableGuideline, setEditableGuideline] =
    useState<SeasonalGuideline | null>(null);

  useEffect(() => {
    // Simulate fetch based on patient profile
    const found =
      mockGuidelines.find(
        (g) =>
          g.region === patient.location &&
          g.dosha_focus === patient.prakriti.toLowerCase()
      ) || mockGuidelines[0];
    setGuideline(found);
    setEditableGuideline({ ...found });
  }, [patient]);

  if (!editableGuideline)
    return (
      <div>
        {t("loading", {
          ns: "components/SuggestSeasonalGuidelines",
          defaultValue: "Loading guidelines...",
        })}
      </div>
    );

  const handleChange = (field: keyof SeasonalGuideline, value: any) => {
    setEditableGuideline((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-2">
          {t("title", { ns: "components/SuggestSeasonalGuidelines" })}{" "}
          {patient.name}
        </h2>
        <div className="mb-2">
          <label className="font-semibold">
            {t("season", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Season:",
            })}
          </label>{" "}
          {editableGuideline.season_name}
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("region", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Region:",
            })}
          </label>{" "}
          {editableGuideline.region}
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("dosha_focus", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Dosha Focus:",
            })}
          </label>{" "}
          {editableGuideline.dosha_focus}
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("recommended_foods", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Recommended Foods:",
            })}
          </label>
          <textarea
            className="w-full border rounded p-1"
            value={editableGuideline.recommended_foods.join(", ")}
            onChange={(e) =>
              handleChange(
                "recommended_foods",
                e.target.value.split(",").map((f) => f.trim())
              )
            }
          />
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("avoided_foods", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Foods to Avoid:",
            })}
          </label>
          <textarea
            className="w-full border rounded p-1"
            value={editableGuideline.avoided_foods.join(", ")}
            onChange={(e) =>
              handleChange(
                "avoided_foods",
                e.target.value.split(",").map((f) => f.trim())
              )
            }
          />
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("general_guidelines", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "General Guidelines:",
            })}
          </label>
          <textarea
            className="w-full border rounded p-1"
            value={editableGuideline.general_guidelines}
            onChange={(e) => handleChange("general_guidelines", e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("lifestyle_recommendations", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Lifestyle Recommendations:",
            })}
          </label>
          <textarea
            className="w-full border rounded p-1"
            value={editableGuideline.lifestyle_recommendations || ""}
            onChange={(e) =>
              handleChange("lifestyle_recommendations", e.target.value)
            }
          />
        </div>
        <div className="mb-2">
          <label className="font-semibold">
            {t("seasonal_allergies_precautions", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Allergy Precautions:",
            })}
          </label>
          <textarea
            className="w-full border rounded p-1"
            value={editableGuideline.seasonal_allergies_precautions || ""}
            onChange={(e) =>
              handleChange("seasonal_allergies_precautions", e.target.value)
            }
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            {t("cancel", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Cancel",
            })}
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => onSend(editableGuideline)}
          >
            {t("submit", {
              ns: "components/SuggestSeasonalGuidelines",
              defaultValue: "Send to Patient",
            })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestSeasonalGuidelines;
