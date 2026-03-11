import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Upload,
  Edit3,
  Trash2,
  Check,
  Stethoscope,
  Heart,
  Activity,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Filter,
  Search,
  X,
  CalendarDays,
  Clock3,
  Award,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Video,
  MapPin as MapPinIcon,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
  period: "morning" | "afternoon" | "evening";
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  avatar: string;
  languages: string[];
  consultationFee: number;
  availableDays: string[];
  timeSlots: TimeSlot[];
  clinicLocation: string;
  about: string;
  patientsTreated: number;
};

function PatientAppointments() {
  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const times = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", // Morning
      "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", // Afternoon
      "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", // Evening
    ];
    
    times.forEach((time, index) => {
      let period: "morning" | "afternoon" | "evening" = "morning";
      if (index >= 6 && index < 12) period = "afternoon";
      else if (index >= 12) period = "evening";
      
      slots.push({
        id: `slot-${index}`,
        time,
        available: Math.random() > 0.3, // Random availability for demo
        period,
      });
    });
    return slots;
  };

  const specialties = [
    { name: "Kayachikitsa (Internal Medicine)", icon: "🌿" },
    { name: "Panchakarma Therapy", icon: "🧘" },
    { name: "Shalya Tantra (Surgery)", icon: "🔪" },
    { name: "Shalakya Tantra (ENT & Ophthalmology)", icon: "👁️" },
    { name: "Kaumarbhritya (Pediatrics)", icon: "👶" },
    { name: "Rasayana (Rejuvenation)", icon: "✨" },
    { name: "Vajikarana (Aphrodisiac Therapy)", icon: "💪" },
    { name: "Dravyaguna (Ayurvedic Pharmacology)", icon: "🌱" },
    { name: "Swasthavritta (Preventive Medicine)", icon: "🛡️" },
    { name: "Manas Roga (Psychiatry)", icon: "🧠" },
    { name: "Ayurvedic Dermatology", icon: "🌟" },
    { name: "Ayurvedic Gynecology", icon: "👩" },
    { name: "Ayurvedic Orthopedics", icon: "🦴" },
    { name: "Ayurvedic Cardiology", icon: "❤️" },
    { name: "Ayurvedic Neurology", icon: "🧠" },
    { name: "Ayurvedic Gastroenterology", icon: "🫀" },
  ];

  const languages = ["English", "Hindi", "Sanskrit", "Malayalam", "Tamil", "Telugu", "Kannada", "Bengali"];
  const locations = ["Kerala Ayurveda Clinic", "Punarjani Hospital", "Dhanwantari Wellness Center", "AyurVAID Hospitals", "Kottakkal Arya Vaidya Sala"];

  const generateDoctors = (): Doctor[] => {
    const doctors: Doctor[] = [];
    const firstNames = ["Arjun", "Lakshmi", "Rajesh", "Priya", "Suresh", "Anita", "Mohan", "Deepa", "Krishna", "Meera"];
    const lastNames = ["Sharma", "Nair", "Verma", "Iyer", "Menon", "Joshi", "Patil", "Reddy", "Singh", "Gupta"];
    
    for (let i = 0; i < 40; i++) {
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      const availableDays = ["Monday", "Wednesday", "Friday"];
      if (Math.random() > 0.5) availableDays.push("Tuesday");
      if (Math.random() > 0.5) availableDays.push("Thursday");
      if (Math.random() > 0.3) availableDays.push("Saturday");
      
      doctors.push({
        id: i + 1,
        name: `Dr. ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        specialty: specialty.name,
        qualification: `BAMS, MD (${specialty.name.split('(')[1]?.replace(')', '') || 'Ayurveda'})`,
        experience: 5 + Math.floor(Math.random() * 25),
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + (i % 70)}.jpg`,
        languages: [languages[Math.floor(Math.random() * languages.length)], languages[Math.floor(Math.random() * languages.length)]],
        consultationFee: 500 + Math.floor(Math.random() * 1500),
        availableDays: availableDays,
        timeSlots: generateTimeSlots(),
        clinicLocation: locations[Math.floor(Math.random() * locations.length)],
        about: "Experienced Ayurvedic practitioner specializing in chronic disease management and preventive healthcare.",
        patientsTreated: 1000 + Math.floor(Math.random() * 9000),
      });
    }
    return doctors;
  };

  const mockDoctors = generateDoctors();

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [problem, setProblem] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [consultationType, setConsultationType] = useState<"clinic" | "video">("clinic");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedFeeRange, setSelectedFeeRange] = useState<[number, number] | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter((doc) => {
      const matchesSearch = !searchQuery || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpecialty = !selectedSpecialty || doc.specialty === selectedSpecialty;
      const matchesExperience = !selectedExperience || doc.experience >= selectedExperience;
      const matchesLanguage = !selectedLanguage || doc.languages.includes(selectedLanguage);
      const matchesFee = !selectedFeeRange || (doc.consultationFee >= selectedFeeRange[0] && doc.consultationFee <= selectedFeeRange[1]);
      
      return matchesSearch && matchesSpecialty && matchesExperience && matchesLanguage && matchesFee;
    });
  }, [selectedSpecialty, searchQuery, selectedExperience, selectedLanguage, selectedFeeRange]);

  const selectedDoctorDetails = selectedDoctor ? mockDoctors.find(d => d.id === selectedDoctor) : null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot || !patientName || !problem) return;

    setLoading(true);
    setTimeout(() => {
      const selectedDoc = mockDoctors.find((d) => d.id === selectedDoctor);
      const selectedTimeSlot = selectedDoc?.timeSlots.find(s => s.id === selectedSlot);
      
      setBookings((prev) => [
        ...prev,
        {
          id: Date.now(),
          doctor: selectedDoc,
          patientName,
          patientAge,
          patientGender,
          problem,
          symptoms,
          additionalInfo,
          consultationType,
          appointmentDate: selectedDate,
          appointmentTime: selectedTimeSlot?.time,
          reports: uploadedFiles,
          bookingDate: new Date().toLocaleString(),
          status: "confirmed",
          bookingId: `APT${Date.now().toString().slice(-8)}`,
        },
      ]);
      setLoading(false);
      setSuccessMsg("🎉 Appointment booked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);

      // Reset form
      setSelectedDoctor(null);
      setSelectedSlot(null);
      setSelectedDate("");
      setProblem("");
      setPatientName("");
      setPatientAge("");
      setPatientGender("");
      setSymptoms("");
      setAdditionalInfo("");
      setConsultationType("clinic");
      setUploadedFiles([]);
      setCurrentStep(1);
    }, 1500);
  };

  const getTimeSlotColor = (period: string) => {
    switch (period) {
      case "morning": return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "afternoon": return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
      case "evening": return "bg-emerald-50/70 text-[#1F5C3F] border-emerald-200 hover:bg-emerald-100";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-[#10B981] rounded-full shadow-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent mb-2">
            Book Your Ayurvedic Consultation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with experienced Ayurvedic doctors and book appointments at your preferred time slots
          </p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-green-800 font-medium">{successMsg}</div>
            </div>
          </div>
        )}

        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? "bg-emerald-500 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step}
                </div>
                <div className={`ml-3 text-sm font-medium ${
                  currentStep >= step ? "text-emerald-600" : "text-gray-500"
                }`}>
                  {step === 1 && "Select Doctor"}
                  {step === 2 && "Choose Time"}
                  {step === 3 && "Patient Details"}
                </div>
                {step < 3 && (
                  <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Doctor Selection & Booking */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-[#10B981] p-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <span>{currentStep === 1 ? "Select Doctor" : currentStep === 2 ? "Choose Time Slot" : "Patient Information"}</span>
                </h2>
              </div>

              <form onSubmit={handleBooking} className="p-6 space-y-6">
                {/* Step 1: Doctor Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showFilters ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      <div className="relative flex-1 max-w-md ml-4">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search doctors, specialties, or qualifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                      <div className="bg-gray-50 p-4 rounded-xl grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Specialty
                          </label>
                          <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">All Specialties</option>
                            {specialties.map((spec) => (
                              <option key={spec.name} value={spec.name}>
                                {spec.icon} {spec.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience
                          </label>
                          <select
                            value={selectedExperience || ""}
                            onChange={(e) => setSelectedExperience(e.target.value ? Number(e.target.value) : null)}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                          >
                            <option value="">Any Experience</option>
                            <option value="5">5+ Years</option>
                            <option value="10">10+ Years</option>
                            <option value="15">15+ Years</option>
                            <option value="20">20+ Years</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                          >
                            <option value="">Any Language</option>
                            {languages.map((lang) => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Doctor Cards */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => {
                            setSelectedDoctor(doctor.id);
                            setCurrentStep(2);
                          }}
                          className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedDoctor === doctor.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={doctor.avatar}
                              alt={doctor.name}
                              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                                  <p className="text-emerald-600 font-medium">{doctor.specialty}</p>
                                  <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center space-x-1 text-amber-500">
                                    <Award className="w-4 h-4" />
                                    <span className="text-sm font-medium">{doctor.experience} years</span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4 inline mr-1" />
                                    {doctor.patientsTreated.toLocaleString()}+ patients
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {doctor.languages.map((lang) => (
                                  <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {lang}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center text-gray-600">
                                    <MapPinIcon className="w-4 h-4 mr-1" />
                                    {doctor.clinicLocation}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <CalendarDays className="w-4 h-4 mr-1" />
                                    {doctor.availableDays.join(", ")}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold text-emerald-600">
                                    ₹{doctor.consultationFee}
                                  </span>
                                  <span className="text-xs text-gray-500">+ taxes</span>
                                </div>
                              </div>

                              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                {doctor.about}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Time Slot Selection */}
                {currentStep === 2 && selectedDoctorDetails && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedDoctorDetails.avatar}
                          alt={selectedDoctorDetails.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedDoctorDetails.name}</h3>
                          <p className="text-sm text-gray-600">{selectedDoctorDetails.specialty}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          const day = new Date(e.target.value).toLocaleDateString('en-US', { weekday: 'long' });
                          setSelectedDay(day);
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Available Time Slots</h4>
                        
                        {/* Morning Slots */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-amber-600 mb-2">Morning</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedDoctorDetails.timeSlots
                              .filter(slot => slot.period === "morning")
                              .map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot(slot.id)}
                                  className={`p-2 text-sm border rounded-lg transition-all ${
                                    selectedSlot === slot.id
                                      ? "bg-emerald-500 text-white border-emerald-500"
                                      : slot.available
                                      ? getTimeSlotColor(slot.period)
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  }`}
                                >
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {slot.time}
                                </button>
                              ))}
                          </div>
                        </div>

                        {/* Afternoon Slots */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-orange-600 mb-2">Afternoon</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedDoctorDetails.timeSlots
                              .filter(slot => slot.period === "afternoon")
                              .map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot(slot.id)}
                                  className={`p-2 text-sm border rounded-lg transition-all ${
                                    selectedSlot === slot.id
                                      ? "bg-emerald-500 text-white border-emerald-500"
                                      : slot.available
                                      ? getTimeSlotColor(slot.period)
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  }`}
                                >
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {slot.time}
                                </button>
                              ))}
                          </div>
                        </div>

                        {/* Evening Slots */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-[#1F5C3F] mb-2">Evening</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedDoctorDetails.timeSlots
                              .filter(slot => slot.period === "evening")
                              .map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!slot.available}
                                  onClick={() => setSelectedSlot(slot.id)}
                                  className={`p-2 text-sm border rounded-lg transition-all ${
                                    selectedSlot === slot.id
                                      ? "bg-emerald-500 text-white border-emerald-500"
                                      : slot.available
                                      ? getTimeSlotColor(slot.period)
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                  }`}
                                >
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {slot.time}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        disabled={!selectedSlot || !selectedDate}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white rounded-lg hover:from-emerald-600 hover:to-[#10B981]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Patient Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Patient Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Appointment Summary</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-600">Doctor:</span> {selectedDoctorDetails?.name}</p>
                        <p><span className="text-gray-600">Specialty:</span> {selectedDoctorDetails?.specialty}</p>
                        <p><span className="text-gray-600">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><span className="text-gray-600">Time:</span> {selectedDoctorDetails?.timeSlots.find(s => s.id === selectedSlot)?.time}</p>
                        <p><span className="text-gray-600">Consultation Fee:</span> ₹{selectedDoctorDetails?.consultationFee}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Full name"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="Age"
                          required
                          min="1"
                          max="120"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consultation Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setConsultationType("clinic")}
                            className={`p-2 border rounded-lg flex items-center justify-center space-x-2 ${
                              consultationType === "clinic"
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <MapPinIcon className="w-4 h-4" />
                            <span>In-Clinic</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultationType("video")}
                            className={`p-2 border rounded-lg flex items-center justify-center space-x-2 ${
                              consultationType === "video"
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <Video className="w-4 h-4" />
                            <span>Video</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chief Complaint *
                      </label>
                      <input
                        type="text"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Describe your main health concern"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Symptoms
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="List your symptoms in detail"
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Any medical history, current medications, or allergies"
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Reports (Optional)
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors"
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-1">Drag & drop files or</p>
                        <label className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer text-sm">
                          Browse
                          <input
                            type="file"
                            multiple
                            onChange={handleFileInput}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                        </label>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !patientName || !problem}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-[#10B981] text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-[#10B981]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Booking...</span>
                          </div>
                        ) : (
                          <span>Confirm Booking · ₹{selectedDoctorDetails?.consultationFee}</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar - My Appointments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-[#10B981] to-emerald-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>My Appointments</span>
                </h2>
              </div>

              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Book your first consultation above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {bookings.map((booking, idx) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3 mb-3">
                          <img
                            src={booking.doctor.avatar}
                            alt={booking.doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {booking.doctor.name}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {booking.doctor.specialty}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {booking.patientName} • {booking.patientAge} yrs
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Booking ID:</span>
                            <span className="font-mono text-xs">{booking.bookingId}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {new Date(booking.appointmentDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                            <Clock className="w-3 h-3 text-gray-400 ml-2" />
                            <span className="text-xs text-gray-600">{booking.appointmentTime}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {booking.consultationType === "video" ? (
                              <Video className="w-3 h-3 text-[#10B981]" />
                            ) : (
                              <MapPinIcon className="w-3 h-3 text-emerald-500" />
                            )}
                            <span className="text-xs text-gray-600 capitalize">{booking.consultationType}</span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Confirmed
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>24/7 Support: +91-1800-123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>care@ayurhealth.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Available in 25+ cities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointments;