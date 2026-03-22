import React, { useMemo, useState } from "react";

const PrakritiFinalization: React.FC = () => {
  // Example: Replace with real API data
  const pendingAssessments = [
    {
      id: 1,
      patient: "John Doe",
      Doctor: "Dr. Sharma",
      status: "Verified",
      prakritiType: "Vata-Pitta",
      submittedAt: "2025-09-18 14:32",
      age: 34,
      gender: "Male",
      notes: "Patient shows strong Vata dominance with mild Pitta.",
    },
    {
      id: 2,
      patient: "Jane Smith",
      Doctor: "Dr. Patel",
      status: "Verified",
      prakritiType: "Kapha",
      submittedAt: "2025-09-19 10:15",
      age: 28,
      gender: "Female",
      notes: "Kapha prakriti confirmed. No conflicting symptoms.",
    },
  ];

  const handleFinalize = (id: number) => {
    // TODO: API call to finalize and publish
    alert(`Finalized assessment ${id}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Verified">("all");

  const filteredAssessments = useMemo(() => {
    return pendingAssessments.filter((assessment) => {
      const matchesSearch =
        assessment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.Doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.prakritiType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || assessment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pendingAssessments, searchTerm, statusFilter]);

  const summary = {
    total: pendingAssessments.length,
    visible: filteredAssessments.length,
    verified: pendingAssessments.filter((a) => a.status === "Verified").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1F5C3F] leading-tight">
        Prakriti Assessment Finalization
      </h2>

      {/* Desktop Summary + Filters */}
      <div className="hidden md:block mb-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Total Assessments</div>
            <div className="text-2xl font-bold text-[#1F5C3F] mt-1">{summary.total}</div>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Verified</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{summary.verified}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Visible Records</div>
            <div className="text-2xl font-bold text-[#1F5C3F] mt-1">{summary.visible}</div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient, doctor, or prakriti type..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "Verified")}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredAssessments.map((a) => (
          <div
            key={a.id}
            className="rounded-xl shadow-md border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-base font-semibold text-[#1F5C3F]">{a.patient}</div>
                <div className="text-xs text-gray-600 mt-0.5">{a.age} years • {a.gender}</div>
              </div>
              <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-bold border border-green-300 text-xs">
                {a.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Doctor</span>
                <span className="text-[#1F5C3F] font-semibold text-right">{a.Doctor}</span>
              </div>
              <div className="flex justify-between gap-3 items-start">
                <span className="text-gray-500">Prakriti</span>
                <span className="inline-block px-2 py-1 rounded bg-emerald-200 text-[#1F5C3F] font-semibold text-xs">
                  {a.prakritiType}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-700 text-right">{a.submittedAt}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 mb-1">Notes</div>
              <p className="text-sm text-gray-700 leading-relaxed">{a.notes}</p>
            </div>

            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2.5 rounded shadow font-semibold transition text-sm"
              onClick={() => handleFinalize(a.id)}
            >
              Finalize & Publish
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg bg-gradient-to-br from-emerald-50 to-white p-2">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-[#1F5C3F] text-white">
              <th className="p-3 font-semibold">Patient</th>
              <th className="p-3 font-semibold">Age</th>
              <th className="p-3 font-semibold">Gender</th>
              <th className="p-3 font-semibold">Doctor</th>
              <th className="p-3 font-semibold">Prakriti Type</th>
              <th className="p-3 font-semibold">Submitted</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Notes</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.map((a, idx) => (
              <tr
                key={a.id}
                className={
                  idx % 2 === 0
                    ? "bg-white hover:bg-emerald-50 transition"
                    : "bg-emerald-50 hover:bg-emerald-100 transition"
                }
              >
                <td className="p-3 font-medium text-[#1F5C3F]">{a.patient}</td>
                <td className="p-3">{a.age}</td>
                <td className="p-3">{a.gender}</td>
                <td className="p-3 text-[#1F5C3F] font-semibold">
                  {a.Doctor}
                </td>
                <td className="p-3">
                  <span className="inline-block px-2 py-1 rounded bg-emerald-200 text-[#1F5C3F] font-semibold">
                    {a.prakritiType}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{a.submittedAt}</td>
                <td className="p-3">
                  <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-bold border border-green-300">
                    {a.status}
                  </span>
                </td>
                <td className="p-3 max-w-xs text-gray-700">{a.notes}</td>
                <td className="p-3">
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-4 py-2 rounded shadow font-semibold transition whitespace-nowrap"
                    onClick={() => handleFinalize(a.id)}
                  >
                    Finalize & Publish
                  </button>
                </td>
              </tr>
            ))}
            {filteredAssessments.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No assessments match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 sm:mt-6 text-gray-600 text-xs sm:text-sm text-center sm:text-right">
        Showing {filteredAssessments.length} of {pendingAssessments.length} pending assessments
      </div>
    </div>
  );
};

export default PrakritiFinalization;
