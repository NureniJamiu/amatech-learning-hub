"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Upload, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useAppContext } from "@/context/app-context";
import {
  useUpdateProfile,
  useUploadAvatar,
  useProfileCompletion,
  type ProfileUpdateData,
} from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { currentUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    matricNumber: currentUser?.matricNumber ?? "",
    level: currentUser?.level ?? 100,
    currentSemester: currentUser?.currentSemester ?? 1,
  });

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const profileCompletion = useProfileCompletion(currentUser);

  // Update form data when current user changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        matricNumber: currentUser.matricNumber ?? "",
        level: currentUser.level ?? 100,
        currentSemester: currentUser.currentSemester ?? 1,
      });
    }
  }, [currentUser]);

  const handleInputChange = (field: keyof ProfileUpdateData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      matricNumber: currentUser?.matricNumber ?? "",
      level: currentUser?.level ?? 100,
      currentSemester: currentUser?.currentSemester ?? 1,
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Use toast.promise for better UX
    toast.promise(
      uploadAvatarMutation.mutateAsync(file),
      {
        pending: "Uploading avatar...",
        success: "Avatar updated successfully! 🎉",
        error: "Failed to upload avatar. Please try again."
      }
    );

    // Clear the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Profile
          </DialogTitle>
          <DialogDescription>
            View and update your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Completion Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span>{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {currentUser.avatar ? (
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className={`absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors ${
                  uploadAvatarMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-3 w-3" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadAvatarMutation.isPending}
                />
              </label>
            </div>
            <div>
              <h3 className="font-medium">{currentUser.name ?? "User"}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email ?? "No email"}</p>
              <p className="text-sm text-muted-foreground">
                Level {currentUser.level ?? "N/A"} • Semester {currentUser.currentSemester ?? "N/A"}
              </p>
              {uploadAvatarMutation.isPending && (
                <p className="text-xs text-blue-600 font-medium mt-1">
                  Uploading avatar...
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Profile Information</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={isEditing ? formData.name : (currentUser.name ?? "")}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? formData.email : (currentUser.email ?? "")}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matric Number</Label>
                <Input
                  id="matricNumber"
                  value={isEditing ? formData.matricNumber : (currentUser.matricNumber ?? "")}
                  onChange={(e) => handleInputChange("matricNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input value={currentUser.faculty ?? ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input value={currentUser.department ?? ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                {isEditing ? (
                  <Select
                    value={formData.level.toString()}
                    onValueChange={(value) => handleInputChange("level", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                      <SelectItem value="300">300</SelectItem>
                      <SelectItem value="400">400</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={(currentUser.level ?? 100).toString()} disabled />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Current Semester</Label>
                {isEditing ? (
                  <Select
                    value={formData.currentSemester.toString()}
                    onValueChange={(value) => handleInputChange("currentSemester", parseInt(value) as 1 | 2)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={`${currentUser.currentSemester ?? 1}${(currentUser.currentSemester ?? 1) === 1 ? 'st' : 'nd'} Semester`} disabled />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
