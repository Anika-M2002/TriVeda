import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Building2, Save, Shield } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    clinicName: "TrivedaCare",
    supportEmail: "support@trivedacare.com",
    timezone: "Asia/Kolkata",
    language: "English",
    emailAlerts: true,
    pushAlerts: true,
    weeklyReports: true,
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Admin settings were updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-1 text-sm text-gray-600">Manage dashboard preferences, notifications, security, and organization details.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Building2 className="h-5 w-5 text-[#1F5C3F]" /> Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input id="clinic-name" value={settings.clinicName} onChange={(e) => setSettings((prev) => ({ ...prev, clinicName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" value={settings.supportEmail} onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(v) => setSettings((prev) => ({ ...prev, language: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(v) => setSettings((prev) => ({ ...prev, timezone: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Bell className="h-5 w-5 text-[#1F5C3F]" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-500">Receive important updates via email</p>
                </div>
                <Switch checked={settings.emailAlerts} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, emailAlerts: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">Push Alerts</p>
                  <p className="text-sm text-gray-500">Show dashboard notifications in real time</p>
                </div>
                <Switch checked={settings.pushAlerts} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, pushAlerts: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Get weekly summary on Mondays</p>
                </div>
                <Switch checked={settings.weeklyReports} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, weeklyReports: v }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Shield className="h-5 w-5 text-[#1F5C3F]" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add extra login protection for admins</p>
                </div>
                <Switch checked={settings.twoFactorAuth} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, twoFactorAuth: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">Login Alerts</p>
                  <p className="text-sm text-gray-500">Notify on new device login</p>
                </div>
                <Switch checked={settings.loginAlerts} onCheckedChange={(v) => setSettings((prev) => ({ ...prev, loginAlerts: v }))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="bg-gradient-to-r from-[#1F5C3F] to-[#10B981] text-white hover:from-[#1F5C3F]/90 hover:to-[#10B981]/90" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
