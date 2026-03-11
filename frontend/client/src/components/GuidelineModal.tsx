import React, { useState } from "react";
import { X, Sparkles, Edit, CheckCircle, Loader2 } from "lucide-react";

interface PatientInfo {
  id: string;
  name: string;
  prakriti: string;
  location: string;
  vikriti?: string;
}

interface GuidelineModalProps {
  patient: PatientInfo;
  onClose: () => void;
  onSend: (guideline: any) => void;
}

const mockAIGuideline = (vikriti: string) =>
  `Seasonal guideline for vikriti: ${vikriti}\n\n- Avoid cold, heavy foods\n- Prefer warm, light, and easily digestible meals\n- Practice daily abhyanga (oil massage)\n- Maintain regular sleep and meal times\n- Stay hydrated with warm herbal teas\n- Gentle yoga and pranayama recommended`;

export default function GuidelineModal({
  patient,
  onClose,
  onSend,
}: GuidelineModalProps) {
  const [step, setStep] = useState<
    "choose" | "ai" | "manual" | "review" | "sent"
  >("choose");
  const [loading, setLoading] = useState(false);
  const [aiGuideline, setAIGuideline] = useState("");
  const [manualGuideline, setManualGuideline] = useState("");
  const [selectedGuideline, setSelectedGuideline] = useState("");

  const handleGenerateAI = () => {
    setLoading(true);
    setTimeout(() => {
      setAIGuideline(mockAIGuideline(patient.vikriti || patient.prakriti));
      setSelectedGuideline(
        mockAIGuideline(patient.vikriti || patient.prakriti)
      );
      setLoading(false);
      setStep("review");
    }, 1200);
  };

  const handleManual = () => {
    setManualGuideline("");
    setStep("manual");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedGuideline(manualGuideline);
    setStep("review");
  };

  const handleSend = () => {
    setStep("sent");
    setTimeout(() => {
      onSend(selectedGuideline);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border-4 border-[#1F5C3F] animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1F5C3F]"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-[#1F5C3F] flex items-center gap-2">
          <Sparkles className="w-6 h-6 animate-pulse" /> Suggest Seasonal
          Guidelines
        </h2>
        <p className="text-gray-600 mb-6">
          For{" "}
          <span className="font-semibold text-[#1F5C3F]">{patient.name}</span>{" "}
          ({patient.prakriti} / {patient.vikriti || "Vikriti not set"})
        </p>

        {step === "choose" && (
          <div className="space-y-6">
            <button
              className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
              onClick={handleGenerateAI}
              disabled={loading}
            >
              <Sparkles className="w-6 h-6" /> Generate with AI
            </button>
            <button
              className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
              onClick={handleManual}
              disabled={loading}
            >
              <Edit className="w-6 h-6" /> Create Manually
            </button>
          </div>
        )}

        {step === "ai" && loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-[#1F5C3F] animate-spin mb-4" />
            <p className="text-lg text-[#1F5C3F] font-semibold">
              Generating guideline with AI...
            </p>
          </div>
        )}

        {step === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Enter Guideline
            </label>
            <textarea
              className="w-full border-2 border-emerald-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#10B981] min-h-[120px]"
              value={manualGuideline}
              onChange={(e) => setManualGuideline(e.target.value)}
              required
              placeholder="Type seasonal guideline for this patient..."
            />
            <button
              type="submit"
              className="w-full bg-[#1F5C3F] hover:bg-[#1F5C3F]/90 text-white px-6 py-2 rounded-lg font-semibold mt-2 shadow"
            >
              Review Guideline
            </button>
          </form>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <div className="bg-gray-50 border-l-4 border-[#10B981] rounded-lg p-4">
              <h3 className="font-semibold text-[#1F5C3F] mb-2">
                Guideline Preview
              </h3>
              <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                {selectedGuideline}
              </pre>
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              onClick={handleSend}
            >
              <CheckCircle className="w-6 h-6" /> Send to Patient
            </button>
            <button
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold"
              onClick={() => setStep("choose")}
            >
              Back
            </button>
          </div>
        )}

        {step === "sent" && (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <p className="text-lg font-semibold text-green-700 mb-2">
              Guideline Sent!
            </p>
            <p className="text-gray-600 mb-4">
              The guideline has been sent to{" "}
              <span className="font-bold text-[#1F5C3F]">{patient.name}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
