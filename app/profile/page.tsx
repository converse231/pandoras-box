"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  User,
  Mail,
  Camera,
  Save,
  X,
  ArrowLeft,
  Lock,
  Bell,
  Globe,
  Palette,
  Shield,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme: currentTheme, setTheme: setGlobalTheme } = useTheme();

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("PHP");
  const [language, setLanguage] = useState("en");
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState({
    email: true,
    priceAlerts: true,
    newsletter: false,
  });
  const [avatarUrl, setAvatarUrl] = useState("/api/placeholder/100/100");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);
        setEmail(user.email || "");

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 = no rows returned
          console.error("Error loading profile:", profileError);
          setError("Failed to load profile");
          return;
        }

        if (profile) {
          setFullName(profile.full_name || "");
          setBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url || "/api/placeholder/100/100");
          setPreferredCurrency(profile.preferred_currency || "PHP");
          setLanguage(profile.language || "en");
          setThemePreference(profile.theme || "system");
          setNotifications({
            email: profile.email_notifications ?? true,
            priceAlerts: profile.price_alerts ?? true,
            newsletter: profile.newsletter ?? false,
          });

          // Set the global theme
          setGlobalTheme(profile.theme || "system");
        }
      } catch (err) {
        console.error("Error in loadProfile:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [supabase, router, setGlobalTheme]);

  const handleSave = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);
      setError(null);

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl,
          preferred_currency: preferredCurrency,
          language: language,
          theme: themePreference,
          email_notifications: notifications.email,
          price_alerts: notifications.priceAlerts,
          newsletter: notifications.newsletter,
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      // Update global theme
      setGlobalTheme(themePreference);

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values by reloading
    setIsEditing(false);
    router.refresh();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 dark:from-neutral-950 dark:via-amber-950/10 dark:to-neutral-900">
      {/* Header */}
      <header className="border-b border-amber-200/50 dark:border-amber-800/30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-amber-100 dark:hover:bg-amber-950/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Pandora's Box
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Profile Settings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Saved!</span>
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2"
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="general" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            {/* Profile Picture Card */}
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Update your profile photo and personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-amber-200 dark:border-amber-800">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white text-3xl font-bold">
                        {fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setIsEditing(true);
                        }}
                        placeholder="Enter your full name"
                        className="border-amber-200/50 dark:border-amber-800/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="pl-10 border-amber-200/50 dark:border-amber-800/30 bg-muted/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setIsEditing(true);
                    }}
                    placeholder="Tell us about yourself and your jewelry collection..."
                    rows={4}
                    className="flex w-full rounded-md border border-amber-200/50 dark:border-amber-800/30 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-600" />
                  App Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency" className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Preferred Currency
                  </Label>
                  <Select
                    value={preferredCurrency}
                    onValueChange={(value) => {
                      setPreferredCurrency(value);
                      setIsEditing(true);
                    }}
                  >
                    <SelectTrigger
                      id="currency"
                      className="border-amber-200/50 dark:border-amber-800/30"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">🇵🇭 PHP - Philippine Peso</SelectItem>
                      <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                      <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">🇯🇵 JPY - Japanese Yen</SelectItem>
                      <SelectItem value="AUD">🇦🇺 AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    All prices will be displayed in this currency
                  </p>
                </div>

                <Separator />

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600" />
                    Language
                  </Label>
                  <Select
                    value={language}
                    onValueChange={(value) => {
                      setLanguage(value);
                      setIsEditing(true);
                    }}
                  >
                    <SelectTrigger
                      id="language"
                      className="border-amber-200/50 dark:border-amber-800/30"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="tl">🇵🇭 Tagalog</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                      <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Theme */}
                <div className="space-y-2">
                  <Label htmlFor="theme" className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600" />
                    Theme
                  </Label>
                  <Select
                    value={themePreference}
                    onValueChange={(value: "light" | "dark" | "system") => {
                      setThemePreference(value);
                      setIsEditing(true);
                    }}
                  >
                    <SelectTrigger
                      id="theme"
                      className="border-amber-200/50 dark:border-amber-800/30"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Light Mode</SelectItem>
                      <SelectItem value="dark">🌙 Dark Mode</SelectItem>
                      <SelectItem value="system">💻 System Default</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-600" />
                        Password
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Last changed 3 months ago
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Active Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Manage devices where you're logged in
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      View Sessions
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-4 pt-4">
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-amber-200/50 dark:border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => {
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      });
                      setIsEditing(true);
                    }}
                    className="w-5 h-5 rounded border-amber-200 dark:border-amber-800 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                <Separator />

                {/* Price Alerts */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Gold Price Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when gold prices change significantly
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.priceAlerts}
                    onChange={(e) => {
                      setNotifications({
                        ...notifications,
                        priceAlerts: e.target.checked,
                      });
                      setIsEditing(true);
                    }}
                    className="w-5 h-5 rounded border-amber-200 dark:border-amber-800 text-amber-600 focus:ring-amber-500"
                  />
                </div>

                <Separator />

                {/* Newsletter */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive tips and updates about jewelry investment
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newsletter}
                    onChange={(e) => {
                      setNotifications({
                        ...notifications,
                        newsletter: e.target.checked,
                      });
                      setIsEditing(true);
                    }}
                    className="w-5 h-5 rounded border-amber-200 dark:border-amber-800 text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

