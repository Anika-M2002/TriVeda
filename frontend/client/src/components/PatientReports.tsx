import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  User,
  Eye,
  XCircle,
  Award,
  Download,
  Share2,
  ChevronRight,
  Clock,
  Heart,
  Activity,
  Sparkles,
  Leaf,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Bell,
  Filter,
  Search,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";

// Mock reports data (unchanged)
const mockReports = [
  {
    id: 1,
    title: "Comprehensive Health Report",
    date: "2025-09-10",
    doctor: {
      name: "Dr. Anjali Verma",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      specialty: "Ayurvedic Physician",
    },
    summary:
      "All vitals normal. Continue current lifestyle. Minor vitamin D deficiency detected.",
    details: `
      <b>Vitals:</b> All within normal range.<br/>
      <b>Deficiency:</b> Vitamin D (mild)<br/>
      <b>Recommendations:</b> Increase sun exposure, supplement if needed.<br/>
  <b>Doctor's Note:</b> Excellent progress. Keep up the good work!<br/>
      <b>Next Steps:</b> <span style='color:#059669'>No action required</span>`,
    actionable: false,
  },
  {
    id: 2,
    title: "Quarterly Diabetes Review",
    date: "2025-06-15",
    doctor: {
      name: "Dr. Vikram Patel",
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      specialty: "Endocrinologist",
    },
    summary: "HbA1c slightly above target. Adjust medication and diet.",
    details: `
      <b>Test:</b> HbA1c<br/>
      <b>Result:</b> 7.2% (target: < 7%)<br/>
      <b>Recommendations:</b> Reduce sugar intake, increase physical activity.<br/>
  <b>Doctor's Note:</b> Medication adjusted. Follow up in 3 months.<br/>
      <b>Next Steps:</b> <span style='color:#f59e42'>Book follow-up appointment</span>`,
    actionable: true,
    actionLabel: "Book Follow-up",
    action: () => alert("Booking follow-up with Dr. Vikram Patel..."),
  },
  {
    id: 3,
    title: "Annual Eye Checkup",
    date: "2024-12-20",
    doctor: {
      name: "Dr. Riya Sethi",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      specialty: "Ophthalmologist",
    },
    summary: "No vision changes. Mild dryness noted.",
    details: `
      <b>Test:</b> Visual Acuity, Eye Pressure<br/>
      <b>Findings:</b> Normal vision, mild dryness.<br/>
      <b>Recommendations:</b> Use lubricating drops, reduce screen time.<br/>
  <b>Doctor's Note:</b> No major concerns.<br/>
      <b>Next Steps:</b> <span style='color:#059669'>No action required</span>`,
    actionable: false,
  },
  {
    id: 4,
    title: "Cardiac Risk Assessment",
    date: "2024-10-05",
    doctor: {
      name: "Dr. Suresh Menon",
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      specialty: "Cardiologist",
    },
    summary:
      "Mildly elevated cholesterol. Advised dietary changes and exercise.",
    details: `
      <b>Test:</b> Lipid Profile, ECG<br/>
      <b>Findings:</b> LDL cholesterol slightly high, ECG normal.<br/>
      <b>Recommendations:</b> Start daily walks, reduce saturated fats.<br/>
  <b>Doctor's Note:</b> No medication needed at this time.<br/>
      <b>Next Steps:</b> <span style='color:#f59e42'>Update diet plan</span>`,
    actionable: true,
    actionLabel: "Update Diet Plan",
    action: () => alert("Redirecting to diet plan update..."),
  },
  {
    id: 5,
    title: "Allergy Panel Results",
    date: "2024-07-18",
    doctor: {
      name: "Dr. Meera Joshi",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
      specialty: "Immunologist",
    },
    summary: "Mild allergy to peanuts and dust mites detected.",
    details: `
      <b>Test:</b> IgE Allergy Panel<br/>
      <b>Findings:</b> Mild reaction to peanuts, dust mites.<br/>
      <b>Recommendations:</b> Avoid exposure, carry antihistamines.<br/>
  <b>Doctor's Note:</b> Inform school/workplace.<br/>
      <b>Next Steps:</b> <span style='color:#f59e42'>Add to allergy list</span>`,
    actionable: true,
    actionLabel: "Add to Allergy List",
    action: () => alert("Adding to allergy list..."),
  },
  {
    id: 6,
    title: "Physical Therapy Progress",
    date: "2024-05-12",
    doctor: {
      name: "Dr. Rajeev Kumar",
      image: "https://randomuser.me/api/portraits/men/61.jpg",
      specialty: "Physiotherapist",
    },
    summary: "Improved mobility in left knee. Continue exercises.",
    details: `
      <b>Session:</b> 8/12 completed<br/>
      <b>Progress:</b> Range of motion improved by 20%.<br/>
      <b>Recommendations:</b> Continue home exercises, next review in 2 weeks.<br/>
  <b>Doctor's Note:</b> Great effort!<br/>
      <b>Next Steps:</b> <span style='color:#f59e42'>Book next session</span>`,
    actionable: true,
    actionLabel: "Book Next Session",
    action: () => alert("Booking next physical therapy session..."),
  },
];

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

export default function PatientReports() {
  const [selectedReport, setSelectedReport] = useState<
    null | (typeof mockReports)[0]
  >(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [bookedIds, setBookedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "actionable" | "recent">("all");

  // Helper to handle booking and show message
  const handleAction = (report: (typeof mockReports)[0]) => {
    setBookedIds((ids) => [...ids, report.id]);
    setSuccessMsg(`Booked follow-up with ${report.doctor.name} successfully!`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  // Filter reports
  const filteredReports = mockReports.filter((report) => {
    if (filterType === "actionable") return report.actionable;
    if (filterType === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(report.date) >= thirtyDaysAgo;
    }
    return true;
  }).filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mostRecent = filteredReports[0];
  const otherReports = filteredReports.slice(1);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Success alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl shadow-2xl">
              <div className="p-1 bg-emerald-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-medium">{successMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight break-words">
                  Health Reports
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mt-1 leading-relaxed">
                  Track and manage your medical reports
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex w-full lg:w-auto flex-wrap gap-2 sm:gap-3">
              <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl shadow-sm min-w-[120px] flex-1 lg:flex-none">
                <p className="text-xs text-gray-500">Total Reports</p>
                <p className="text-xl font-bold text-emerald-600">{mockReports.length}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl shadow-sm min-w-[120px] flex-1 lg:flex-none">
                <p className="text-xs text-gray-500">Action Required</p>
                <p className="text-xl font-bold text-amber-600">
                  {mockReports.filter(r => r.actionable).length}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title, doctor, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Reports" },
                { value: "actionable", label: "Action Required" },
                { value: "recent", label: "Last 30 Days" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value as any)}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all text-sm sm:text-base ${
                    filterType === filter.value
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50"
          >
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <>
            {/* Most Recent Report - Featured */}
            {mostRecent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10"
              >
                <div className="relative group">
                  {/* Decorative gradient line */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-full -mr-10 -mt-10 opacity-20"></div>
                    
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start md:items-center">
                      {/* Doctor Info */}
                      <div className="flex flex-col items-center self-center md:self-auto">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-50"></div>
                          <img
                            src={mostRecent.doctor.image}
                            alt={mostRecent.doctor.name}
                            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover"
                          />
                          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Recent
                          </span>
                        </div>
                        <div className="text-center mt-4">
                          <div className="font-bold text-gray-900 text-lg">
                            {mostRecent.doctor.name}
                          </div>
                          <div className="text-sm text-emerald-600">
                            {mostRecent.doctor.specialty}
                          </div>
                        </div>
                      </div>

                      {/* Report Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {mostRecent.date}
                          </div>
                          {mostRecent.actionable && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Action Required
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 flex items-start sm:items-center gap-2 leading-tight break-words">
                          <FileText className="w-6 h-6 text-emerald-500" />
                          {mostRecent.title}
                        </h2>

                        <p className="text-gray-600 mb-6">{mostRecent.summary}</p>

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                            onClick={() => setSelectedReport(mostRecent)}
                          >
                            <Eye className="w-5 h-5" />
                            View Full Report
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                          >
                            <Download className="w-5 h-5 text-gray-600" />
                          </motion.button>
                          
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                          >
                            <Share2 className="w-5 h-5 text-gray-600" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other Reports Grid */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {otherReports.map((report, idx) => {
                const isBooked = bookedIds.includes(report.id);
                const isActionable = report.actionable;

                return (
                  <motion.div
                    key={report.id}
                    variants={fadeInUp}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 h-full flex flex-col">
                      {/* Card Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <img
                            src={report.doctor.image}
                            alt={report.doctor.name}
                            className="w-14 h-14 rounded-full border-2 border-emerald-200 object-cover"
                          />
                          {isActionable && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {report.doctor.name}
                          </div>
                          <div className="text-xs text-emerald-600">
                            {report.doctor.specialty}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                        {isActionable && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-amber-600 font-medium">Action needed</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                        <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{report.title}</span>
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-gray-600 mb-4 flex-1">
                        {report.summary}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        
                        {isActionable && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isBooked
                                ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                                : "bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg"
                            }`}
                            onClick={() => !isBooked && handleAction(report)}
                            disabled={isBooked}
                          >
                            {isBooked ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Booked
                              </span>
                            ) : (
                              report.actionLabel
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* Modal for report details */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedReport(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden"
              >
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"></div>
                
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setSelectedReport(null)}
                    aria-label="Close"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedReport.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {selectedReport.date}
                        </div>
                        {selectedReport.actionable && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                    <img
                      src={selectedReport.doctor.image}
                      alt={selectedReport.doctor.name}
                      className="w-16 h-16 rounded-full border-2 border-emerald-300 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {selectedReport.doctor.name}
                      </div>
                      <div className="text-sm text-emerald-600">
                        {selectedReport.doctor.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div
                    className="prose prose-emerald max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: selectedReport.details }}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    {selectedReport.actionable && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg transition-all ${
                          bookedIds.includes(selectedReport.id)
                            ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl"
                        }`}
                        onClick={() =>
                          !bookedIds.includes(selectedReport.id) &&
                          handleAction(selectedReport)
                        }
                        disabled={bookedIds.includes(selectedReport.id)}
                      >
                        {bookedIds.includes(selectedReport.id) ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Booked
                          </span>
                        ) : (
                          selectedReport.actionLabel
                        )}
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setSelectedReport(null)}
                    >
                      Close
                    </motion.button>
                  </div>

                  {/* Additional Actions */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </button>
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