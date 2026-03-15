import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Eye,
  XCircle,
  UserPlus,
  UserMinus,
  Users,
  Clock,
  Shield,
  User,
  Activity,
  Heart,
  Sparkles,
  Leaf,
  Download,
  Share2,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
} from "lucide-react";

// Mock health records data (unchanged)
const mockHealthRecords = [
  {
    id: 1,
    title: "Annual Blood Test",
    date: "2025-08-10",
    summary: "Normal CBC, slightly elevated cholesterol.",
    details: `
      <b>Test:</b> Complete Blood Count, Lipid Profile<br/>
      <b>Findings:</b> All values within normal range except LDL cholesterol (borderline high).<br/>
  <b>Doctor's Note:</b> Maintain current diet, increase physical activity, recheck in 6 months.`,
  },
  {
    id: 2,
    title: "X-Ray - Chest",
    date: "2025-06-22",
    summary: "No abnormalities detected.",
    details: `
      <b>Test:</b> Chest X-Ray<br/>
      <b>Findings:</b> Clear lungs, no signs of infection or mass.<br/>
  <b>Doctor's Note:</b> No action needed.`,
  },
  {
    id: 3,
    title: "Blood Pressure Check",
    date: "2025-04-15",
    summary: "BP slightly elevated, advised lifestyle changes.",
    details: `
      <b>Test:</b> Blood Pressure<br/>
      <b>Findings:</b> 135/88 mmHg<br/>
  <b>Doctor's Note:</b> Reduce salt intake, regular exercise, monitor weekly.`,
  },
  {
    id: 4,
    title: "COVID-19 RT-PCR",
    date: "2024-12-01",
    summary: "Negative.",
    details: `
      <b>Test:</b> RT-PCR for SARS-CoV-2<br/>
      <b>Findings:</b> Negative<br/>
  <b>Doctor's Note:</b> Continue precautions.`,
  },
];

// Mock users (doctors/admins) (unchanged)
const mockUsers = [
  { id: "d1", name: "Dr. A. Sharma", role: "Doctor" },
  { id: "d2", name: "Dr. B. Singh", role: "Doctor" },
  { id: "a1", name: "Admin R. Patel", role: "Admin" },
];

// Initial access and view logs (unchanged)
const initialAccess = {
  1: ["d1"],
  2: ["d2", "a1"],
  3: [],
  4: ["a1"],
};
const initialViewLogs = {
  1: [{ userId: "d1", date: "2025-09-18" }],
  2: [
    { userId: "d2", date: "2025-09-19" },
    { userId: "a1", date: "2025-09-20" },
  ],
  3: [],
  4: [{ userId: "a1", date: "2025-09-17" }],
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PatientHealthRecords() {
  const [selectedRecord, setSelectedRecord] = useState<
    null | (typeof mockHealthRecords)[0]
  >(null);
  const [access, setAccess] = useState<{ [recordId: number]: string[] }>(initialAccess);
  const [viewLogs, setViewLogs] = useState<{
    [recordId: number]: { userId: string; date: string }[];
  }>(initialViewLogs);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Grant access to a user for a record
  const grantAccess = (recordId: number, userId: string) => {
    setAccess((prev) => ({
      ...prev,
      [recordId]: [...(prev[recordId] || []), userId],
    }));
  };

  // Revoke access
  const revokeAccess = (recordId: number, userId: string) => {
    setAccess((prev) => ({
      ...prev,
      [recordId]: (prev[recordId] || []).filter((id) => id !== userId),
    }));
  };

  // Filter records
  const filteredRecords = mockHealthRecords.filter((rec) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(rec.date) >= thirtyDaysAgo;
    }
    return true;
  }).filter((rec) => 
    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color based on record type
  const getRecordColor = (title: string) => {
    if (title.includes("Blood")) return "rose";
    if (title.includes("X-Ray")) return "blue";
    if (title.includes("Pressure")) return "amber";
    if (title.includes("COVID")) return "purple";
    return "emerald";
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#10B981] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-[#10B981] to-[#0D9488] bg-clip-text text-transparent">
                  Health Records
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                  Manage and track your medical history securely
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex gap-3">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Total Records</p>
                <p className="text-xl font-bold text-emerald-600">{mockHealthRecords.length}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">With Access</p>
                <p className="text-xl font-bold text-[#1F5C3F]">
                  {Object.values(access).flat().length}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {["all", "recent"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-emerald-500 to-[#10B981] text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white"
                  }`}
                >
                  {filter === "all" ? "All Records" : "Last 30 Days"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Records Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {filteredRecords.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No records found</p>
            </motion.div>
          ) : (
            filteredRecords.map((rec, idx) => {
              const allowedUsers = access[rec.id] || [];
              const viewers = (viewLogs[rec.id] || [])
                .map((log) => {
                  const user = mockUsers.find((u) => u.id === log.userId);
                  return user ? { ...user, date: log.date } : null;
                })
                .filter(Boolean) as Array<{
                  id: string;
                  name: string;
                  role: string;
                  date: string;
                }>;
              const recordColor = getRecordColor(rec.title);

              return (
                <motion.div
                  key={rec.id}
                  variants={fadeInUp}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all overflow-hidden relative group`}
                >
                  {/* Decorative gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${recordColor}-500 to-${recordColor}-600`}></div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left side - Record Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br from-${recordColor}-100 to-${recordColor}-200`}>
                            <FileText className={`w-6 h-6 text-${recordColor}-600`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {rec.date}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${recordColor}-100 text-${recordColor}-800`}>
                                {rec.title.includes("Blood") ? "Lab Report" : 
                                 rec.title.includes("X-Ray") ? "Imaging" : 
                                 rec.title.includes("Pressure") ? "Vital" : "Test"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 pl-16">{rec.summary}</p>

                      {/* Viewers */}
                      <div className="pl-16 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Viewed by:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {viewers.length === 0 ? (
                            <span className="text-sm text-gray-400 italic">No views yet</span>
                          ) : (
                            viewers.map((v) => (
                              <div
                                key={v.id}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                              >
                                <User className="w-3 h-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700">{v.name}</span>
                                <span className="text-xs text-gray-400">({v.role})</span>
                                <span className="text-xs text-gray-400 ml-1">• {v.date}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Access Controls */}
                      <div className="pl-16">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Access Control:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mockUsers.map((user) =>
                            allowedUsers.includes(user.id) ? (
                              <motion.button
                                key={user.id}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium hover:bg-rose-200 transition-all border border-rose-200"
                                onClick={() => revokeAccess(rec.id, user.id)}
                              >
                                <Lock className="w-3 h-3" />
                                Revoke {user.name}
                              </motion.button>
                            ) : (
                              <motion.button
                                key={user.id}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-all border border-emerald-200"
                                onClick={() => grantAccess(rec.id, user.id)}
                              >
                                <Unlock className="w-3 h-3" />
                                Grant {user.name}
                              </motion.button>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full"
                        onClick={() => setSelectedRecord(rec)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all w-full"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Modal for record details */}
        <AnimatePresence>
          {selectedRecord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedRecord(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden"
              >
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#10B981] to-[#0D9488]"></div>
                
                <div className="p-8">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setSelectedRecord(null)}
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-100 rounded-xl">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedRecord.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {selectedRecord.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div
                        className="text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedRecord.details }}
                      />
                    </div>

                    {/* Viewers in modal */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-500" />
                        Viewed by
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(viewLogs[selectedRecord.id] || []).length === 0 ? (
                          <span className="text-sm text-gray-400 italic">No views yet</span>
                        ) : (
                          (viewLogs[selectedRecord.id] || []).map((log, i) => {
                            const user = mockUsers.find((u) => u.id === log.userId);
                            return user ? (
                              <div
                                key={user.id + log.date}
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg"
                              >
                                <User className="w-3 h-3 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">
                                  {user.name}
                                </span>
                                <span className="text-xs text-gray-500">({user.role})</span>
                                <span className="text-xs text-gray-400">• {log.date}</span>
                              </div>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>

                    {/* Access controls in modal */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Manage Access
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mockUsers.map((user) =>
                          (access[selectedRecord.id] || []).includes(user.id) ? (
                            <motion.button
                              key={user.id}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between p-3 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-all border border-rose-200"
                              onClick={() => revokeAccess(selectedRecord.id, user.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.name}</span>
                              </div>
                              <span className="text-xs">Revoke</span>
                            </motion.button>
                          ) : (
                            <motion.button
                              key={user.id}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200"
                              onClick={() => grantAccess(selectedRecord.id, user.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Unlock className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.name}</span>
                              </div>
                              <span className="text-xs">Grant</span>
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                        onClick={() => setSelectedRecord(null)}
                      >
                        Close
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}