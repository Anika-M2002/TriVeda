import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Trash2,
  Edit3,
  Save,
  XCircle,
  CheckCircle,
  Bell,
  Globe,
  Utensils,
  Settings,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  Leaf,
} from "lucide-react";

// Mock user settings data (updated - removed medical info)
const initialSettings = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91-9876543210",
  password: "********",
  language: "English",
  notifications: true,
  dietaryPreference: "Vegetarian",
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function PatientSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [editField, setEditField] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Handlers for editing fields
  const handleEdit = (field: string) => setEditField(field);
  const handleCancel = () => setEditField(null);
  const handleSave = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setEditField(null);
    setSuccessMsg("Changes saved successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Save all changes
  const handleSaveAll = () => {
    setSuccessMsg("All changes saved successfully!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  type SettingFieldProps = {
    icon: React.ElementType;
    label: string;
    field: string;
    value: any;
    type?: string;
    options?: string[] | null;
  };

  const SettingField: React.FC<SettingFieldProps> = ({
    icon: Icon,
    label,
    field,
    value,
    type = "text",
    options = null,
  }) => (
    <motion.div 
      variants={fadeInUp} 
      className="bg-white rounded-xl border border-gray-100 p-4 hover:border-emerald-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
        
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          
          {editField === field ? (
            <div className="flex items-center gap-2 mt-1">
              {options ? (
                <select
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                  value={value}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex-1 relative">
                  <input
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none pr-8"
                    type={type === "password" && showPassword ? "text" : type}
                    value={value}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                  {type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}
              
              <button
                type="button"
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                onClick={() => handleSave(field, value)}
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={handleCancel}
                title="Cancel"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-medium text-gray-900">
                {field === "password" ? "••••••••" : value}
              </span>
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                onClick={() => handleEdit(field)}
                title="Edit"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="relative max-w-4xl mx-auto">
        {/* Header with creative elements */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            Customize your preferences and manage your account information
          </p>
        </motion.div>

        {/* Success Message with animation */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl text-sm"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium">{successMsg}</span>
          </motion.div>
        )}

        {/* Creative tabs navigation - Updated to only two tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-6 p-1 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto"
        >
          {[
            { id: "personal", label: "Personal", icon: User },
            { id: "preferences", label: "Preferences", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {activeTab === "personal" && (
            <motion.div key="personal" {...fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SettingField icon={User} label="Full Name" field="name" value={settings.name} />
                <SettingField icon={Mail} label="Email" field="email" value={settings.email} type="email" />
                <SettingField icon={Phone} label="Phone" field="phone" value={settings.phone} type="tel" />
                <SettingField icon={Lock} label="Password" field="password" value={settings.password} type="password" />
              </div>
            </motion.div>
          )}

          {activeTab === "preferences" && (
            <motion.div key="preferences" {...fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Your Preferences</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SettingField
                  icon={Globe}
                  label="Language"
                  field="language"
                  value={settings.language}
                  options={["English", "Hindi", "Bengali", "Tamil", "Telugu", "Malayalam", "Kannada"]}
                />
                <SettingField
                  icon={Utensils}
                  label="Dietary Preference"
                  field="dietaryPreference"
                  value={settings.dietaryPreference}
                  options={["Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian", "Pescatarian"]}
                />

                {/* Notifications Toggle - Creative card */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-emerald-200 transition-all col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Notifications</p>
                        <p className="text-sm text-gray-600">Receive email alerts about appointments and updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: !prev.notifications,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-200 peer-checked:bg-emerald-500 rounded-full peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quick tip card */}
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">Ayurvedic Tip</h4>
                    <p className="text-xs text-gray-600">Your preferences help us personalize your experience and recommendations.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Save Button with creative styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <button
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            onClick={handleSaveAll}
          >
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">
            Your information is encrypted and secure
          </p>
        </motion.div>
      </div>
    </div>
  );
}