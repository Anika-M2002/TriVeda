import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import {
  Stethoscope,
  MapPin,
  Users,
  FileText,
  Send,
  Eye,
  Link2,
  Phone,
  Mail,
  Award,
  Clock,
  Check,
  X,
} from "lucide-react";

const centers = [
  {
    id: 1,
    name: "Ayurveda Wellness Center",
    logo: "https://randomuser.me/api/portraits/med/men/11.jpg",
    location: "Bangalore, India",
    specialties: ["Ayurveda", "Nutrition", "Yoga"],
    rating: 4.8,
    established: "2015",
    contact: {
      email: "contact@ayurveda.com",
      phone: "+91 9876543210",
    },
    connections: [
      {
        id: 3,
        name: "VedaCare Clinic",
        logo: "https://randomuser.me/api/portraits/med/men/13.jpg",
      },
      {
        id: 4,
        name: "Herbal Life Center",
        logo: "https://randomuser.me/api/portraits/med/women/14.jpg",
      },
    ],
    dieticians: [
      {
        id: 1,
        name: "Dr. Rao",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        expertise: "Ayurvedic Diet",
        experience: "12 years",
      },
      {
        id: 2,
        name: "Dr. Mehta",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        expertise: "Seasonal Nutrition",
        experience: "8 years",
      },
      {
        id: 3,
        name: "Dr. Sharma",
        avatar: "https://randomuser.me/api/portraits/men/23.jpg",
        expertise: "Herbal Remedies",
        experience: "15 years",
      },
    ],
    researchPapers: [
      {
        id: 101,
        title: "Advancements in Ayurvedic Diet",
        author: "Dr. Rao",
        status: "Published",
        year: 2024,
        summary:
          "A comprehensive review of modern advancements in Ayurvedic dietary practices.",
        link: "#",
      },
      {
        id: 102,
        title: "Seasonal Guidelines Study",
        author: "Dr. Mehta",
        status: "Pending",
        year: 2025,
        summary:
          "Study on the impact of seasonal guidelines on patient outcomes.",
        link: "#",
      },
    ],
  },
  {
    id: 2,
    name: "Holistic Health Hub",
    logo: "https://randomuser.me/api/portraits/med/women/12.jpg",
    location: "Delhi, India",
    specialties: ["Holistic Medicine", "Diet Planning", "Wellness"],
    rating: 4.9,
    established: "2012",
    contact: {
      email: "info@holistichealth.com",
      phone: "+91 9123456780",
    },
    connections: [
      {
        id: 1,
        name: "Ayurveda Wellness Center",
        logo: "https://randomuser.me/api/portraits/med/men/11.jpg",
      },
      {
        id: 5,
        name: "Nature's Cure",
        logo: "https://randomuser.me/api/portraits/med/women/15.jpg",
      },
    ],
    dieticians: [
      {
        id: 6,
        name: "Dr. Singh",
        avatar: "https://randomuser.me/api/portraits/men/26.jpg",
        expertise: "Herbal Nutrition",
        experience: "10 years",
      },
      {
        id: 7,
        name: "Dr. Verma",
        avatar: "https://randomuser.me/api/portraits/women/27.jpg",
        expertise: "Detox Diets",
        experience: "7 years",
      },
    ],
    researchPapers: [
      {
        id: 201,
        title: "Herbal Nutrition Insights",
        author: "Dr. Singh",
        status: "Published",
        year: 2023,
        summary:
          "Insights into the role of herbal nutrition in preventive healthcare.",
        link: "#",
      },
    ],
  },
];

const HealthcareWellnessNetwork: React.FC = () => {
  const [modal, setModal] = useState<
    | null
    | { type: "connect"; center: any }
    | { type: "message"; center: any }
    | { type: "profile"; center: any }
    | { type: "publish"; center: any; paper: any }
  >(null);
  const [messageText, setMessageText] = useState("");
  const [connectNote, setConnectNote] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePublish = async (center: any, paper: any) => {
    setPublishLoading(true);
    setTimeout(() => {
      setPublishLoading(false);
      setSuccessMsg(`Paper "${paper.title}" published for ${center.name}!`);
      setModal(null);
    }, 1200);
  };

  const handleConnect = async (center: any) => {
    setSuccessMsg(`Connection request sent to ${center.name}!`);
    setModal(null);
    setConnectNote("");
  };

  const handleMessage = async (center: any) => {
    setSuccessMsg(`Message sent to ${center.name}!`);
    setModal(null);
    setMessageText("");
  };

  const handleViewProfile = (center: any) => {
    setModal({ type: "profile", center });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1F5C3F] via-[#10B981] to-[#0D9488] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full mr-4 backdrop-blur-sm">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                Healthcare Network
              </h1>
              <p className="text-emerald-100 text-xl font-medium">
                Connecting Wellness Centers & Healthcare Professionals
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <Users className="w-8 h-8 text-white mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-emerald-100">Healthcare Centers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <Award className="w-8 h-8 text-white mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-emerald-100">Certified Professionals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <FileText className="w-8 h-8 text-white mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-emerald-100">Research Publications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {centers.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:border-emerald-200 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <img
                      src={center.logo}
                      alt={center.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{center.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-emerald-100">{center.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-300">
                          {"★".repeat(Math.floor(center.rating))}
                        </div>
                        <span className="text-sm text-emerald-100">
                          {center.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm text-emerald-100">
                          Est. {center.established}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Specialties */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {center.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-gradient-to-r from-emerald-50 to-green-50 text-[#1F5C3F] px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 hover:shadow-md transition-all duration-300"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Healthcare Professionals */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Healthcare Professionals ({center.dieticians.length})
                  </h4>
                  <div className="space-y-3">
                    {center.dieticians.slice(0, 2).map((professional) => (
                      <div
                        key={professional.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors duration-300"
                      >
                        <img
                          src={professional.avatar}
                          alt={professional.name}
                          className="w-12 h-12 rounded-full border-2 border-emerald-200 object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            {professional.name}
                          </div>
                          <div className="text-sm text-[#1F5C3F] font-medium">
                            {professional.expertise}
                          </div>
                          <div className="text-xs text-gray-500">
                            {professional.experience} experience
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Available
                        </div>
                      </div>
                    ))}
                    {center.dieticians.length > 2 && (
                      <div className="text-sm text-[#1F5C3F] font-medium text-center">
                        +{center.dieticians.length - 2} more professionals
                      </div>
                    )}
                  </div>
                </div>

                {/* Network Connections */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Network Connections
                  </h4>
                  <div className="flex items-center gap-3">
                    {center.connections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50/30 px-3 py-2 rounded-full border border-green-200"
                      >
                        <img
                          src={connection.logo}
                          alt={connection.name}
                          className="w-8 h-8 rounded-full border-2 border-green-300 object-cover"
                        />
                        <span className="text-sm font-medium text-green-700">
                          {connection.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Papers */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Research Publications
                  </h4>
                  <div className="space-y-3">
                    {center.researchPapers.map((paper) => (
                      <div
                        key={paper.id}
                        className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-lg border border-gray-200 hover:border-emerald-300 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {paper.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                              {paper.summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>By {paper.author}</span>
                              <span>Year: {paper.year}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                paper.status === "Published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {paper.status}
                            </span>
                            {paper.status !== "Published" && (
                              <button
                                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-300"
                                onClick={() =>
                                  setModal({ type: "publish", center, paper })
                                }
                              >
                                Publish
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#1F5C3F]" />
                      <a
                        href={`mailto:${center.contact.email}`}
                        className="text-[#1F5C3F] hover:text-[#1F5C3F] font-medium"
                      >
                        {center.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-green-600" />
                      <a
                        href={`tel:${center.contact.phone}`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        {center.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-gradient-to-r from-[#1F5C3F] to-[#10B981]/90 text-white py-3 px-4 rounded-lg font-semibold hover:from-[#1F5C3F]/90 hover:to-[#10B981] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    onClick={() => setModal({ type: "connect", center })}
                  >
                    <Link2 className="w-5 h-5" />
                    Connect
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    onClick={() => setModal({ type: "message", center })}
                  >
                    <Send className="w-5 h-5" />
                    Message
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#1F5C3F] to-[#0D9488] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#1F5C3F]/90 hover:to-[#0D9488]/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    onClick={() => handleViewProfile(center)}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}

      {/* Connect Modal */}
      <Dialog
        open={!!modal && modal.type === "connect"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Link2 className="w-6 h-6 text-[#1F5C3F]" />
              Connect with {modal?.type === "connect" && modal.center.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Send a connection request to this wellness center. Add a
              personalized note to introduce yourself.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Note (Optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] resize-none"
              rows={4}
              placeholder="Introduce yourself and explain why you'd like to connect..."
              value={connectNote}
              onChange={(e) => setConnectNote(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6 gap-3">
            <DialogClose asChild>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300">
                Cancel
              </button>
            </DialogClose>
            <button
              className="px-6 py-3 bg-gradient-to-r from-[#1F5C3F] to-[#10B981]/90 text-white rounded-lg font-semibold hover:from-[#1F5C3F]/90 hover:to-[#10B981] transition-all duration-300 shadow-lg"
              onClick={() => modal && handleConnect(modal.center)}
            >
              Send Connection Request
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog
        open={!!modal && modal.type === "message"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Send className="w-6 h-6 text-green-600" />
              Message {modal?.type === "message" && modal.center.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Send a direct message to this wellness center for inquiries or
              collaboration.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message *
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={5}
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-6 gap-3">
            <DialogClose asChild>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300">
                Cancel
              </button>
            </DialogClose>
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!messageText.trim()}
              onClick={() => modal && handleMessage(modal.center)}
            >
              Send Message
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog
        open={!!modal && modal.type === "profile"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="bg-white border-0 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Eye className="w-6 h-6 text-[#1F5C3F]" />
              Center Profile
            </DialogTitle>
          </DialogHeader>
          {modal?.type === "profile" && (
            <div className="mt-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-emerald-50/30 to-emerald-50/30 rounded-xl">
                <img
                  src={modal.center.logo}
                  alt={modal.center.name}
                  className="w-24 h-24 rounded-full border-4 border-emerald-200 shadow-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {modal.center.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{modal.center.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(modal.center.rating))}
                      </div>
                      <span className="font-semibold text-gray-700">
                        {modal.center.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Est. {modal.center.established}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#1F5C3F]" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {modal.center.specialties.map((spec: string) => (
                        <span
                          key={spec}
                          className="bg-emerald-100 text-[#1F5C3F] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Healthcare Team
                    </h4>
                    <div className="space-y-2">
                      {modal.center.dieticians.map((d: any) => (
                        <div
                          key={d.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-10 h-10 rounded-full border-2 border-green-200"
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              {d.name}
                            </div>
                            <div className="text-sm text-green-600">
                              {d.expertise}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-[#1F5C3F]" />
                      Network Connections
                    </h4>
                    <div className="space-y-2">
                      {modal.center.connections.map((c: any) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg"
                        >
                          <img
                            src={c.logo}
                            alt={c.name}
                            className="w-10 h-10 rounded-full border-2 border-emerald-200"
                          />
                          <span className="font-medium text-[#1F5C3F]">
                            {c.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#1F5C3F]" />
                      Contact Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-[#10B981]" />
                        <span className="text-[#1F5C3F] font-medium">
                          {modal.center.contact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          {modal.center.contact.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button className="px-6 py-3 bg-gradient-to-r from-[#1F5C3F] to-[#0D9488] text-white rounded-lg font-semibold hover:from-[#1F5C3F]/90 hover:to-[#0D9488]/90 transition-all duration-300 shadow-lg">
                Close Profile
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Modal */}
      <Dialog
        open={!!modal && modal.type === "publish"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-600" />
              Publish Research Paper
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              You're about to publish this research paper. This action will make
              it publicly available and notify the research community.
            </DialogDescription>
          </DialogHeader>
          {modal?.type === "publish" && (
            <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-2">
                {modal.paper.title}
              </h4>
              <p className="text-gray-600 mb-3">{modal.paper.summary}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Author: {modal.paper.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Year: {modal.paper.year}
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Center: {modal.center.name}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 gap-3">
            <DialogClose asChild>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300">
                Cancel
              </button>
            </DialogClose>
            <button
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={publishLoading}
              onClick={() =>
                modal &&
                modal.type === "publish" &&
                handlePublish(modal.center, modal.paper)
              }
            >
              {publishLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Publish Paper
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={!!successMsg} onOpenChange={() => setSuccessMsg(null)}>
        <DialogContent className="bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              Success!
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50/30 rounded-xl border border-green-200">
            <p className="text-lg text-gray-800 font-medium">{successMsg}</p>
            <p className="text-sm text-gray-600 mt-2">
              You will receive a confirmation email shortly with next steps.
            </p>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-[#10B981] text-white rounded-lg font-semibold hover:from-green-700 hover:to-[#10B981]/90 transition-all duration-300 shadow-lg">
                Continue
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthcareWellnessNetwork;
