import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Stethoscope,
  Languages,
  Shield,
  Lock,
  Briefcase,
  X,
  Plus,
  Calendar,
  GraduationCap,
  Trophy,
  Edit3,
  Save,
  MapPin,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDoctorProfile, useUpdateDoctorProfile } from "@/hooks/useProfile";
import { useChangePassword } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UpdateDoctorProfilePayload } from "@/api/profile.api";
import type { ChangePasswordPayload } from "@/api/auth.api";

const genderOptions = ["Male", "Female", "Other"] as const;
const qualificationOptions = [
  "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
  "MD (Ayurveda)",
  "PhD (Ayurveda)",
  "Ayurvedic Doctor",
  "Ayurvedic Therapist",
  "Diploma in Panchakarma",
  "Diploma in Ayurvedic Pharmacy",
] as const;

const computeAgeFromDob = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return Math.max(age, 0);
};

const normalizeList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
};

export default function DoctorProfile() {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("triveda_user") || "{}");
  const doctorId = user?.role === "DOCTOR" ? String(user?.id || user?.staffId || "") : "";

  const { data: doctorProfileData, isLoading, isError, error } = useDoctorProfile(doctorId);
  const updateDoctorProfileMutation = useUpdateDoctorProfile();
  const changePasswordMutation = useChangePassword();

  const profilePayload: any = (doctorProfileData as any)?.data || doctorProfileData || {};
  const doctorProfile = profilePayload?.doctorProfile || {};

  const initialFormState = useMemo<UpdateDoctorProfilePayload>(
    () => ({
      staffId: String(profilePayload?.id || user?.id || ""),
      name: String(profilePayload?.name || user?.name || ""),
      gender: String(profilePayload?.gender || "Other"),
      dateOfBirth: profilePayload?.dateOfBirth
        ? new Date(profilePayload.dateOfBirth).toISOString().split("T")[0]
        : "",
      qualifications: normalizeList(doctorProfile?.qualifications),
      locality: String(doctorProfile?.locality || ""),
      languages: normalizeList(doctorProfile?.languages),
      specialty: String(doctorProfile?.specialty || ""),
      experienceYrs: Number(doctorProfile?.experienceYrs ?? 0) || 0,
      certificates: String(doctorProfile?.certificates || ""),
      previousWork: String(doctorProfile?.previousWork || ""),
      extraInfo: String(doctorProfile?.extraInfo || ""),
      caseSummaries: normalizeList(doctorProfile?.caseSummaries),
      education: normalizeList(doctorProfile?.education),
    }),
    [doctorProfile, profilePayload?.dateOfBirth, profilePayload?.gender, profilePayload?.id, profilePayload?.name, user?.id, user?.name]
  );

  const [profileForm, setProfileForm] = useState<UpdateDoctorProfilePayload>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [languageInput, setLanguageInput] = useState("");
  const [qualificationInput, setQualificationInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [educationInput, setEducationInput] = useState("");
  const [passwordForm, setPasswordForm] = useState<ChangePasswordPayload>({
    staffId: String(user?.id || ""),
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setProfileForm(initialFormState);
  }, [initialFormState]);

  useEffect(() => {
    setPasswordForm((prev) => ({ ...prev, staffId: String(user?.id || "") }));
  }, [user?.id]);

  const email = profilePayload?.email || user?.email || "";
  const avatarUrl = typeof profilePayload?.profileImageUrl === "string" ? profilePayload.profileImageUrl : "";
  const departmentName = doctorProfile?.department?.name || "Not assigned";
  const successCount = Number(profilePayload?.successCount ?? 0) || 0;
  const unsuccessfulCount = Number(profilePayload?.unsuccessfulCount ?? 0) || 0;

  const age = useMemo(() => {
    if (profileForm.dateOfBirth) return computeAgeFromDob(profileForm.dateOfBirth);
    return Number(profilePayload?.age ?? 0) || 0;
  }, [profileForm.dateOfBirth, profilePayload?.age]);

  const addListValue = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    updater: (next: string) => void,
    duplicateMessage: string
  ) => {
    const next = value.trim();
    if (!next) return;
    updater(next);
    setter("");
    toast({ title: duplicateMessage, description: `Added: ${next}` });
  };

  const addLanguage = () => {
    const next = languageInput.trim();
    if (!next) return;

    if (profileForm.languages.some((lang) => lang.toLowerCase() === next.toLowerCase())) {
      toast({
        title: "Language already exists",
        description: `\"${next}\" is already in your languages list.`,
      });
      return;
    }

    addListValue(
      languageInput,
      setLanguageInput,
      (value) => setProfileForm((prev) => ({ ...prev, languages: [...prev.languages, value] })),
      "Language added"
    );
  };

  const addQualification = () => {
    const next = qualificationInput.trim();
    if (!next) return;

    if (profileForm.qualifications.some((item) => item.toLowerCase() === next.toLowerCase())) {
      toast({
        title: "Qualification already exists",
        description: `\"${next}\" is already in your qualifications list.`,
      });
      return;
    }

    addListValue(
      qualificationInput,
      setQualificationInput,
      (value) => setProfileForm((prev) => ({ ...prev, qualifications: [...prev.qualifications, value] })),
      "Qualification added"
    );
  };

  const addCaseSummary = () => {
    const next = summaryInput.trim();
    if (!next) return;
    addListValue(
      summaryInput,
      setSummaryInput,
      (value) => setProfileForm((prev) => ({ ...prev, caseSummaries: [...prev.caseSummaries, value] })),
      "Summary added"
    );
  };

  const addEducation = () => {
    const next = educationInput.trim();
    if (!next) return;
    addListValue(
      educationInput,
      setEducationInput,
      (value) => setProfileForm((prev) => ({ ...prev, education: [...prev.education, value] })),
      "Education added"
    );
  };

  const handleSaveProfile = () => {
    if (!profileForm.staffId) {
      toast({ title: "Validation Error", description: "Doctor ID is missing.", variant: "destructive" });
      return;
    }

    if (!profileForm.name.trim()) {
      toast({ title: "Validation Error", description: "Full name is required.", variant: "destructive" });
      return;
    }

    if (!profileForm.dateOfBirth) {
      toast({ title: "Validation Error", description: "Date of birth is required.", variant: "destructive" });
      return;
    }

    const dob = new Date(profileForm.dateOfBirth);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) {
      toast({ title: "Validation Error", description: "Please provide a valid date of birth.", variant: "destructive" });
      return;
    }

    if (!profileForm.specialty.trim()) {
      toast({ title: "Validation Error", description: "Specialization is required.", variant: "destructive" });
      return;
    }

    if (profileForm.qualifications.length === 0) {
      toast({ title: "Validation Error", description: "At least one qualification is required.", variant: "destructive" });
      return;
    }

    if (!profileForm.locality.trim()) {
      toast({ title: "Validation Error", description: "Locality is required.", variant: "destructive" });
      return;
    }

    if (!Number.isFinite(profileForm.experienceYrs) || profileForm.experienceYrs < 0) {
      toast({ title: "Validation Error", description: "Years of experience must be a non-negative number.", variant: "destructive" });
      return;
    }

    if (!profileForm.certificates.trim()) {
      toast({ title: "Validation Error", description: "Certificates are required.", variant: "destructive" });
      return;
    }

    if (!profileForm.previousWork.trim()) {
      toast({ title: "Validation Error", description: "Previous work details are required.", variant: "destructive" });
      return;
    }

    updateDoctorProfileMutation.mutate(profileForm, {
      onSuccess: () => {
        toast({ title: "Profile Saved", description: "Doctor profile updated successfully." });
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast({
          title: "Save Failed",
          description: error?.message || "Could not update doctor profile.",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordForm.staffId) {
      toast({ title: "Validation Error", description: "Doctor ID is missing.", variant: "destructive" });
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: "Validation Error", description: "All password fields are required.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({ title: "Validation Error", description: "New password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Validation Error", description: "New password and confirm password do not match.", variant: "destructive" });
      return;
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setPasswordForm({ staffId: String(user?.id || ""), currentPassword: "", newPassword: "", confirmPassword: "" });
      },
      onError: (error: any) => {
        toast({ title: "Update Failed", description: error?.message || "Could not update password.", variant: "destructive" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : "Unable to load doctor profile.";
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">{errorMessage}</div>
      </div>
    );
  }

  if (!doctorId) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 p-4">
          Doctor session not found. Please sign in from the doctor portal.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div className="mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#10B981] flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-[#10B981] to-[#0D9488] bg-clip-text text-transparent leading-tight break-words">
                  Doctor Profile
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">Manage your profile for accurate AI matchmaking.</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProfileForm(initialFormState);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={updateDoctorProfileMutation.isPending} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                    <Save className="w-4 h-4 mr-2" />
                    {updateDoctorProfileMutation.isPending ? "Saving..." : "Save Profile"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <Card className="mb-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/50 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-lg">
                <AvatarImage src={avatarUrl} alt={profileForm.name || "Doctor"} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-[#10B981] text-white text-2xl font-semibold">
                  {(profileForm.name || "D")
                    .split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">{profileForm.name || "Doctor"}</h2>
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">{profileForm.specialty || "Not set"}</Badge>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200">{departmentName}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>{email || "No email available"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-5">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/50 p-1">
            <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-[#10B981] data-[state=active]:text-white">Personal</TabsTrigger>
            <TabsTrigger value="professional" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-[#10B981] data-[state=active]:text-white">Professional</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-[#10B981] data-[state=active]:text-white">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Personal & Demographic Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profileForm.name} disabled={!isEditing} onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={profileForm.gender} onValueChange={(value) => setProfileForm((prev) => ({ ...prev, gender: value }))} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      Date of Birth
                    </Label>
                    <Input type="date" value={profileForm.dateOfBirth} disabled={!isEditing} onChange={(e) => setProfileForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label>Age (Auto-calculated)</Label>
                    <Input value={String(age || "")} disabled className="bg-gray-100 dark:bg-gray-700" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Qualifications</Label>
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <Select value="" onValueChange={(value) => setQualificationInput(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick from common qualifications" />
                          </SelectTrigger>
                          <SelectContent>
                            {qualificationOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Input
                            value={qualificationInput}
                            onChange={(e) => setQualificationInput(e.target.value)}
                            placeholder="Add qualification and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addQualification();
                              }
                            }}
                          />
                          <Button type="button" onClick={addQualification} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profileForm.qualifications.length === 0 && <span className="text-sm text-gray-500">No qualifications added yet.</span>}
                      {profileForm.qualifications.map((qualification) => (
                        <Badge key={qualification} className="bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          {qualification}
                          {isEditing && (
                            <button type="button" onClick={() => setProfileForm((prev) => ({ ...prev, qualifications: prev.qualifications.filter((item) => item !== qualification) }))}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-emerald-500" />
                      Languages Spoken
                    </Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          placeholder="Type language and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addLanguage();
                            }
                          }}
                        />
                        <Button type="button" onClick={addLanguage} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profileForm.languages.length === 0 && <span className="text-sm text-gray-500">No languages added yet.</span>}
                      {profileForm.languages.map((language) => (
                        <Badge key={language} className="bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          {language}
                          {isEditing && (
                            <button type="button" onClick={() => setProfileForm((prev) => ({ ...prev, languages: prev.languages.filter((lang) => lang !== language) }))}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Email</Label>
                    <Input value={email} disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Professional Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department (From Database)</Label>
                    <Input value={departmentName} disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                  </div>

                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Input value={profileForm.specialty} disabled={!isEditing} onChange={(e) => setProfileForm((prev) => ({ ...prev, specialty: e.target.value }))} placeholder="Enter specialization" />
                  </div>

                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input type="number" min={0} disabled={!isEditing} value={profileForm.experienceYrs} onChange={(e) => setProfileForm((prev) => ({ ...prev, experienceYrs: Number(e.target.value) || 0 }))} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      Locality
                    </Label>
                    <Input value={profileForm.locality} disabled={!isEditing} onChange={(e) => setProfileForm((prev) => ({ ...prev, locality: e.target.value }))} placeholder="City, State" />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      Successful Cases
                    </Label>
                    <Input value={String(successCount)} disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Unsuccessful Cases</Label>
                    <Input value={String(unsuccessfulCount)} disabled className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <Label className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      Education
                    </Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={educationInput}
                          onChange={(e) => setEducationInput(e.target.value)}
                          placeholder="Add degree, certification, fellowship..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addEducation();
                            }
                          }}
                        />
                        <Button type="button" onClick={addEducation} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="space-y-2">
                      {profileForm.education.length === 0 && <p className="text-sm text-gray-500">No education details added yet.</p>}
                      {profileForm.education.map((item, index) => (
                        <div key={`${item}-${index}`} className="flex items-start justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                          <div className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{item}</span>
                          </div>
                          {isEditing && (
                            <Button type="button" size="sm" variant="ghost" onClick={() => setProfileForm((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== index) }))} className="text-rose-500 hover:text-rose-600">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Certificates
                    </Label>
                    <Input
                      value={profileForm.certificates}
                      disabled={!isEditing}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, certificates: e.target.value }))}
                      placeholder="Provide certificate details or upload link"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Previous Work / Experience</Label>
                    <Input
                      value={profileForm.previousWork}
                      disabled={!isEditing}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, previousWork: e.target.value }))}
                      placeholder="Describe your previous work or clinical experience"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Additional Information</Label>
                    <Input
                      value={profileForm.extraInfo}
                      disabled={!isEditing}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, extraInfo: e.target.value }))}
                      placeholder="Optional extra details"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <Label className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-500" />
                      AI Matchmaker Case Summaries
                    </Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          value={summaryInput}
                          onChange={(e) => setSummaryInput(e.target.value)}
                          placeholder="Handled 50+ successful cases of acute acidity..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCaseSummary();
                            }
                          }}
                        />
                        <Button type="button" onClick={addCaseSummary} className="bg-gradient-to-r from-emerald-500 to-[#10B981]">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="space-y-2">
                      {profileForm.caseSummaries.length === 0 && <p className="text-sm text-gray-500">No case summaries added yet.</p>}
                      {profileForm.caseSummaries.map((summary, index) => (
                        <div key={`${summary}-${index}`} className="flex items-start justify-between gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                          <div className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{summary}</span>
                          </div>
                          {isEditing && (
                            <Button type="button" size="sm" variant="ghost" onClick={() => setProfileForm((prev) => ({ ...prev, caseSummaries: prev.caseSummaries.filter((_, idx) => idx !== index) }))} className="text-rose-500 hover:text-rose-600">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-[#10B981] bg-clip-text text-transparent flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="currentPassword" type="password" className="pl-9" autoComplete="current-password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="newPassword" type="password" className="pl-9" autoComplete="new-password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="confirmPassword" type="password" className="pl-9" autoComplete="new-password" value={passwordForm.confirmPassword || ""} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
                    </div>
                  </div>

                  <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-[#10B981]" disabled={changePasswordMutation.isPending}>
                    {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
